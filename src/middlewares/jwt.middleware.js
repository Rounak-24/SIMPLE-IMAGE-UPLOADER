const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtauthmiddleware = async (req,res,next)=>{
    try{
        const auth = req.header.Authorization || req.cookie?.accessToken;
        if(!auth) return res.status(401).json({error:'Unauthorized'});

        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
        
        const user = await user.findById(decoded._id).select('-password -refreshToken');

        if(!user) return res.status(401).json({err:'Invalid token'});
        else req.user = user;

        next();

    }catch(err){
        res.status(401).json({err:'Invalid token'})
    }
}

module.exports = jwtauthmiddleware;