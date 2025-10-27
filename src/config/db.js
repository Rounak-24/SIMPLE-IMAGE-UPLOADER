const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`connected to mongoDB server, host: ${connectionInstance.connection.host}`)

    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;