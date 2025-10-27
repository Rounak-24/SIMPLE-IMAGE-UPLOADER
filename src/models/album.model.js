const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name:{type:String},
    cover:{type:String},
    description:{type:String},

    images:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'image'
    }]
  
}, {timestamps:true}) 

const album = mongoose.model('album', albumSchema);
module.exports = album;