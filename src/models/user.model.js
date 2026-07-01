import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
      {
         username:{
            type : string,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
         },
         email:{
            type : string,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
             
         },
         fullname:{
            type : string,
            required : true,
            trim : true,
            index : true
         },
         avatar:{
            type : string,
            required: true,
         },
         coverImage:{
            type : string,
            required: true,    
          },
          watchHistory: [{
            type: schema.Types.ObjectId,
            ref: "Vedio",
          }],
          password:{
            type : string,
            required :  [true, "Password is required"], 
          },
          refreshToken:{
            type : string,
          },


   },
   {
      timestamps : true,
   }
);
userSchema.pre("save", async function(next){
   if(!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
   next();
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password);
 }

 useSchema.methods.generateAccessToken = function(){
   return jwt.sign({
         id : this._id,
         username :this.username,
         email : this.email,
         fullname : this.fullname

   },
      process.env.ACCESS_TOKEN_SECRET,
       {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});

 }
  useSchema.methods.generateRefreshToken = function(){
     return jwt.sign({
         id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
       {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
   
 }


export const User = mongoose.model("User", userSchema);