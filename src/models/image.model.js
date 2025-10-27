const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageurl:{type:String},
    size:{type:String},
    format:{type:String},

  
}, {timestamps:true}) 

const image = mongoose.model('image', imageSchema);
module.exports = image;