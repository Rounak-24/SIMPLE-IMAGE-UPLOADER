const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String},
    password:{type:String, required:true},
    avatar:{
        url:{type:String},
        public_id:{type:String}
    },

    albums:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'album'
    }],

    images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'image'
    }],

    refreshToken:{type:String}

},{timestamps:true})

userSchema.pre('save', async function (next){

    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();

})

userSchema.methods.comparePassword = async function (givenPassword){
    return await bcrypt.compare(givenPassword, this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username
        }, process.env.JWT_ACCESS_SECRET_KEY, {

            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const user = mongoose.model('user', userSchema);
module.exports = user;