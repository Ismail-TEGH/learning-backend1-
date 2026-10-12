import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/apiResponse.js';

const generateAccessandRefreshToken = async (userId) => {
        try {
                const user = await User.findById(userId);
                if (!user) {
                        throw new ApiError(404, "User not found");
                }
                const accessToken = user.generateAccessToken();
                const refreshToken = user.generateRefreshToken();
                user.refreshToken = refreshToken;
                await user.save({ validateBeforeSave: false });
                return { accessToken, refreshToken };


        } catch (err) {
                throw new ApiError(500, "Token generation failed");
        }
}

const registerUser = asynchandler(async (req, res) => {

        // get user details from frontend
        // validation - not empty
        // check if user already exists: username, email
        // check for images, check for avatar
        // upload them to cloudinary, avatar
        // create user object - create entry in db
        // remove password and refresh token field from response
        // check for user creation
        // return res
        //    console.log("helobdd")
        //     res.status(200).json({
        //     message: "Register controller reached"
        // });
        // get user details from frontend
        const { username, email, fullname, password } = req.body;
        console.log("email", email)
        console.log("username", username)
        console.log("fullname", fullname)
        console.log("password", password)

        // validation - not empty
        if ([fullname, username, email, password].some(fields => fields.trim() === "")) {
                throw new ApiError(400, "All fields are required");
        }
        // check if user already exists: username, email
        const existedUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existedUser) {
                throw new ApiError(409, "User already exists");
        }
        // check for images, check for avatar
        const avatarLocalPath = req.files?.avatar[0]?.path
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if (!avatarLocalPath) {
                throw new ApiError(400, "Avatar is required");
        }
        console.log(req.files);
        console.log(avatarLocalPath);

        // upload images to cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");
        const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImage");
        if (!avatar) {
                throw new ApiError(500, "Avatar upload required ")
        }
        // create user object - create entry in db
        const user = await User.create({
                username: username.toLowerCase(),
                fullname,
                email,
                password,
                avatar: avatar.url,
                coverImage: coverImage?.url || ""
        })

        // remove password and refresh token field from response
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if (!createdUser) {
                throw new ApiError(500, "User creation failed")
        }
        return res.status(201).json(
                new ApiResponse(201, "User created successfully", createdUser)
        )
})
const loginUser = asynchandler(async (req, res) => {
        //req.body->data
        //username, email,password 
        //find user by username or email
        //if user not found -> throw error
        //compare password with hashed password
        //if password not match -> throw error
        //generate access token and refresh token
        //save refresh token in db
        //send cookie with refresh token and send access token in response

        const { username, email, password } = req.body;
        
        if (!(username || email )) {
                throw new ApiError(400, "All fields are required");
        }
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
                throw new ApiError(404, "User not found");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
                throw new ApiError(401, "Invalid user credentials");
        }
        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const Options = {
                httpOnly: true,
                secure: true
        }
        return res.status(200)
                .cookie("accessToken", accessToken, Options)
                .cookie("refreshToken", refreshToken, Options)
                .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"))



})
const logoutUser = asynchandler(async (req, res) => {
        await User.findByIdAndUpdate(
                req.user._id,
                { $set: { refreshToken: null } },
                { new: true }
        );
        const Options = {
                httpOnly: true,
                secure: true
        }
         return res.status(200)
         .clearcookie("accessToken", Options)
         .clearcookie("refreshToken", Options)
                 .json(new ApiResponse(200,{}, "User logged out successfully"))
})

const refreshAccessToken = asynchandler(async (req, res) => {
        const incommingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!incommingRefreshToken) {
                throw new ApiError(401, "Refresh token is required");
        }

        try{
                const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user = await User.findById(decodedToken._id);
                 if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }    
               if(user.refreshToken !== incommingRefreshToken){
                throw new ApiError(401, "Invalid refresh token");
               }
                const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newRefreshToken} = await generateAccessandRefreshToken(user._id)
         return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )

          }catch (error) {
                throw new ApiError(401, "Invalid refresh token");
        }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken }      