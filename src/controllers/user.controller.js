 import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.isRefreshtoken = refreshToken;
    await user.save({validateBeforeSave: false});
    return { accessToken, refreshToken };
} catch (error) {
    throw new ApiError(500, "Error while generating access and refresh tokens");
}
}
const registerUser = asyncHandler(async (req, res) => {
 const {fullName, email, password,phone} = req.body;
console.log("BODY:", req.body);
if(!fullName||!email||!password){
    throw new ApiError(400,"Please fill all the fields");

 }
const existingUser = await User.findOne({
    $or:[
        {username: fullName},
        {email}
    ]
})
if(existingUser){
    throw new ApiError(409,"User already exists");

}
const user = await User.create({
    username: fullName,
    email,
    password,
    phone,

})
const createdUser = await User.findById(user._id).select("-password" )
if(!createdUser)
{
    throw new ApiError(500,"User not created");
}
return res.status(201).json(new ApiResponse(200,createdUser,"User created successfully"))
})

const loginUser= asyncHandler(async (req, res) => {
    // take the email and password
    // then check validation 
    // check user is exist or not 
    // then 
    const {email, password} = req.body;
    if(!email||!password){
        throw new ApiError(400,"Please fill all the fields");
    
     }
     const user = await User.findOne({email}).select("+password");
     if(!user){
        throw new ApiError(404,"User not found");
     }
     const isPasswordValid = await user.comparePassword(password);
     if(!isPasswordValid){
        throw new ApiError(401,"Invalid password");
     }
     const {accessToken ,refreshToken} = await generateAccessAndRefreshTokens(user._id);
     const loggedInUser = await User.findById(user._id).select("-password");
    const options={
        httpOnly: true,
        secure : true
    }
    return res.status(200).cookie("refreshToken",refreshToken,options).cookie("accessToken",accessToken,options).json(new ApiResponse(200,{accessToken,loggedInUser},"User logged in successfully"))

});
const logoutUser = asyncHandler(async (req, res) => {
   await  User.findByIdAndUpdate(req.user._id,{isRefreshtoken:null},{new:true}).then(()=>{
        return res.status(200).json(new ApiResponse(200,null,"User logged out successfully"))
    }).catch((err)=>{
        throw new ApiError(500,"Error while logging out user");
    })
    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,null,"User logged out successfully"))
});
const refreshAcessToken = asyncHandler(async(req,res)=>{
const incoming = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
if(!incoming){
    throw new ApiError(401,"Refresh token not found");
}
jwt.verify(incoming,process.env.REFRESH_TOKEN_SECRET,async(err,decoded)=>{
    if(err){
        throw new ApiError(401,"Invalid refresh token");
    }
    const user = await User.findById(decoded._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    if(user.isRefreshtoken !== incoming){
        throw new ApiError(401,"Invalid refresh token");
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);
    const options={
        httpOnly: true,
        secure : true
    }
    return res.status(200).cookie("refreshToken",refreshToken,options).cookie("accessToken",accessToken,options).json(new ApiResponse(200,{accessToken},"Access token refreshed successfully"))
})
});
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {currentPassword,NewPassword} = req.body;

    const compareOldPassword = await User.comparePassword(currentPassword);
    if(!compareOldPassword){
        throw new ApiError(401,"Current password is incorrect");
    }
    if(!NewPassword){
        throw new ApiError(400,"New password is required");
    }
    if(currentPassword===NewPassword){
        throw new ApiError(401,"New Password must be different from the old one");
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id,{password:NewPassword},{new:true,runValidators:false});
    if(!updatedUser){
        throw new ApiError(500,"Error while updating password");
    }
    return res.status(200).json(new ApiResponse(200,null,"Password updated successfully"))
})
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(200,req.user,"Current user fetched Successfully");
})
const updateAccountDetails = await asyncHandler(async(req,res)=>{
    const {fullName,email,phone} = req.body;
    const update = await User.findByIdAndUpdate(req.user._id,{fullName:fullName,email:email,phone:phone},{new:true,runValidators:false})

})

export { registerUser,loginUser,logoutUser,refreshAcessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails }