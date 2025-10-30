const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
        })

        fs.unlinkSync(localFilePath);

        return response;
        
    }catch(err){
        fs.unlinkSync(localFilePath);
        return null;
    } 
}

const deleteFromCloudinary = async function (public_id) {
    try{
        if(!public_id) return null;

        const response = await cloudinary.uploader.destroy(public_id,{
            resource_type:'image'
        })

        if(response?.result==="ok") console.log('deleted successfully');
        else console.log('unable to delete');

    }catch(err){
        console.log('error while deleting file',err);
        return null;
    }
}

module.exports = {
    uploadOnCloudinary,
    deleteFromCloudinary
};

