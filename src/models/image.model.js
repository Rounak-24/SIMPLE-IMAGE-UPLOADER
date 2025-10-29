const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageurl:{type:String},
    public_id:{type:String},
    format:{type:String},
    bytes:{type:Number},
    width:{type:Number},
    height:{type:Number}
  
}, {timestamps:true}) 

const image = mongoose.model('image', imageSchema);
module.exports = image;