const user = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
    uploadOnCloudinary,
    deleteFromCloudinary

} = require('../utils/cloudinary');

const cookieOptions = {
    httpOnly: true,
    secure: true,
}

const registerUser = async (req,res)=>{
    try{
        const {username, email, password} = req.body;

        if(!username && !email) return res.status(400).json({error: 'username or email is required'})
        if(!password) return res.status(400).json({error: 'password is required'})

        if(await user.findOne({
            $or:[{username}, {email}]
        })){
            return res.status(400).json({error: 'user already exists'})
        } 
        
        const newuser = new user({
            username:username || "",
            password:password,
            email:email || ""
        })

        const saveuser = await newuser.save();
        const createdUser = await user.findById(saveuser._id).select(
            '-password -refreshToken -albums -images'
        );

        if(!createdUser) res.status(500).json({error: 'something went wrong while creating user'})

        const accessToken = createdUser.generateAccessToken();
        const refreshToken = createdUser.generateRefreshToken();

        createdUser.refreshToken = refreshToken;
        await createdUser.save();

        return res.status(200)
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        .json({createdUser})

    }catch(err){
        res.status(500).json({error: 'Internal Server error'})
    }
}

const loginUser = async (req,res)=>{
    try{
        const {username, email, password} = req.body;

        if(!username && !email) return res.status(400).json({error: 'username or email is required'});
        if(!password) return res.status(400).json({error: 'password is required'});

        const findUser = await user.findOne({
            $or:[{username}, {email}]
        })

        if(!findUser) return res.status(404).json({error: 'user does not exists'});
        
        const isMatch = await findUser.comparePassword(password);
        if(!isMatch) return res.status(400).json({error: 'Incorrect Password'});

        const accessToken = findUser.generateAccessToken();
        const refreshToken = findUser.generateRefreshToken();

        findUser.refreshToken = refreshToken;
        await findUser.save({
            validateBeforeSave:false
        });

        findUser.password = undefined;

        return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({ findUser, accessToken, refreshToken});

    }catch(err){
        res.status(500).json({error: 'Internal Server error'})
    }
}

const logoutUser = async (req,res)=>{
    try{
        await user.findByIdAndUpdate(req.user?._id,{
            $unset:{
                refreshToken:1
            },
        },{new:true})

        return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json({message:'User logged out'})

    }catch(err){
        res.status(500).json({error: 'Internal Server error'})
    }
}

const refreshAccessToken = async (req,res)=>{
    try{
        const auth = req.headers.authorization || req.cookie?.accessToken;
        if(!auth) return res.status(401).json({error:'Unauthorized'});

        const refreshTokenFromUser = auth.split(' ')[1];
        const decoded = jwt.verify(refreshTokenFromUser, process.env.JWT_REFRESH_SECRET_KEY);
        
        const User = await user.findById(decoded._id).select('-password');
        if(!User) return res.status(401).json({err:'Invalid token'});
        
        const newAccessToken = User.generateAccessToken();
        const newRefreshToken = User.generateRefreshToken();

        User.refreshToken = newRefreshToken;
        await User.save();

        res.status(200)
        .cookie('accessToken',newAccessToken,cookieOptions)
        .cookie('refreshToken',newRefreshToken,cookieOptions)
        .json({message:'Access token refreshed', newAccessToken, newRefreshToken})

    }catch(err){
        res.status(401).json({err:'error'})
    }
}

const getProfile = async (req,res)=>{
    try{
        const findUser = await user.findById(req.user._id).select(
            '-password -refreshToken'
        );

        return res.status(200)
        .json({findUser})

    }catch(err){
        res.status(500).json({error: 'Error while fetching user info'})
    }
}

const changePassword = async(req,res)=>{
    try{
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmPassword) return res.status(400).json({error:'all fields are required'});

        const findUser = await user.findById(req.user?._id);
        if(!findUser) res.status(404).json({error:'user not found'});

        if(!await findUser.comparePassword(oldPassword)){
            return res.status(400).json({error:'Incorrect current password'});
        }

        if(newPassword!==confirmPassword) return res.status(400).json({error:'confirm password accurately'});

        findUser.password = newPassword;
        await findUser.save();

        res.status(200).json({message: 'password changed successfully'});

    }catch(err){
        res.status(500).json({err:'Internal Server error'});
    }
}

const updateProfile = async(req,res)=>{
    try{
        const newData = req.body;

        const response = await user.findByIdAndUpdate(req.user?._id,newData,{
            new:true,
        }).select('-password -refreshToken');

        res.status(200).json({response, message:'user profile updated successfully'});

    }catch(err){
        res.status(500).json({err:'Internal Server error'});
    }
}

const updateUserAvatar = async(req,res)=>{
    try{
        const localFilePath = req.file?.path;

        if(!localFilePath) return res.status(400).json({error:'no file is selected'});

        if(req.user?.avatar){
            await deleteFromCloudinary(req.user.avatar.public_id);
        }

        const uploadAvatar = await uploadOnCloudinary(localFilePath);
        if(!uploadAvatar) return res.status(400).json({error:'error while uploading avatar'});

        const updateAvatar = await user.findByIdAndUpdate(req.user?._id, {
            $set:{
                avatar:{url:uploadAvatar.url, public_id:uploadAvatar.public_id}
            }

        },{new:true}).select('-password -refreshToken -images -albums')

        res.status(200).json({avatar:updateAvatar.url, message:'user avatar updated successfully'});

    }catch(err){
        res.status(500).json({err:'Internal Server error'});
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getProfile,
    changePassword,
    updateProfile,
    updateUserAvatar

}

