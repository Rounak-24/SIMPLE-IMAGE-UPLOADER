const user = require('../models/user.model');

const cookieOptions = {
    htthttpOnly:true,
    secure:true,
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
        const refreshToken = createdUser.generateAccessToken();

        createdUser.refreshToken = refreshToken;
        await createdUser.save();

        return res.status(200)
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        .json({createdUser})

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server error'})
    }
}

module.exports = {
    registerUser,

}

