import {asynchandler} from '../utils/asynchandler.js'; 
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asynchandler(async (req,res,next) => {
   try{
      const token =  req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
    if(!token){
        throw new ApiError(401, "Unauthorized access");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
   }catch(error){
    throw new ApiError(401, error?.message || "Invalid access token");
   }
})