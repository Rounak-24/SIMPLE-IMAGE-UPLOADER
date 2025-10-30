const image = require('../models/image.model');
const user = require('../models/user.model');
const {
    uploadOnCloudinary,
    deleteFromCloudinary
} = require('../utils/cloudinary')

const getImgs = async(req,res)=>{
    try{
        const findUser = await user.findById(req.user?._id).select(
            '-password -refreshToken -avatar -email'
        );
        
        res.status(200).json({findUser});

    }catch(err){
        res.status(500).json({err:'Internal Server error'});
    }
}

const uploadImage = async (req, res)=>{
    try{
        if(!req.files) return res.status(400).json({error:'no file is selected'});
        const imageArr = req.files;

        const newImgIdArr = [];

        for (const img of imageArr) {
            const imageLocalPath = img.path;

            const uploadImg = await uploadOnCloudinary(imageLocalPath);

            const newImgInfo = {
                imageurl:uploadImg.url,
                public_id:uploadImg.public_id,
                format:uploadImg.format,
                bytes:uploadImg.bytes,
                width:uploadImg.width,
                height:uploadImg.height
            }

            const newImg = new image(newImgInfo);
            const saveImg = await newImg.save();
            
            newImgIdArr.push(saveImg._id);

        }

        const saveToUser = await user.findByIdAndUpdate(req.user?._id,{
            $addToSet:{
                images:newImgIdArr
            }
        }).select('-password -refreshToken -email -avatar');

        res.status(200).json({message:'Image added successfully'});

    }catch(err){
        res.status(500).json({err:'Internal Server error'}); 
    }
}

const removeImg = async (req, res)=>{
    try{
        const findImage = await image.findOne({imageurl: req.body.url});
        if(!findImage) return res.status(404).json({error:'Image Not found'});

        const remove = await user.findByIdAndUpdate(req.user?._id,{
            $pull:{
                images:findImage._id
            }
        },{new:true}).select('-password -refreshToken -email -albums -images');

        await deleteFromCloudinary(findImage.public_id);
        await image.findByIdAndDelete(findImage._id);

        res.status(200).json({remove, message:'Image removed from favourites successfully'});

    }catch(err){
       res.status(500).json({err:'Internal Server error'}); 
    }
}

const getImageInfo = async (req, res)=>{
    try{
        const findImage = await image.findOne({imageurl:req.body.url});
        if(!findImage) return res.status(404).json({error:'Image Not found'});

        return res.status(200).json({imageInfo:findImage});

    }catch(err){
       res.status(500).json({err:'Internal Server error'}); 
    }
}

// const getFavImages = async (req, res)=>{
//     try{
//         const findUser = await user.findById(req.user?._id);
//         const response = findUser.favImages;


//     }catch(err){
//        res.status(500).json({err:'Internal Server error'}); 
//     }
// }

const addtoFav = async (req, res)=>{
    try{
        const findImage = await image.findOne({imageurl: req.body.url});
        if(!findImage) return res.status(404).json({error:'Image Not found'});

        const addtoUserFav = await user.findByIdAndUpdate(req.user?._id,{
            $addToSet:{
                favImages:findImage._id
            }
        },{new:true});

        res.status(200).json({message:'Image added to favourites successfully'});

    }catch(err){
       res.status(500).json({err:'Internal Server error'}); 
    }
}

const removeFromFav = async (req, res)=>{
    try{
        const findImage = await image.findOne({imageurl: req.body.url});
        if(!findImage) return res.status(404).json({error:'Image Not found'});

        const remove = await user.findByIdAndUpdate(req.user?._id,{
            $pull:{
                favImages:findImage._id
            }
        },{new:true}).select('-password -refreshToken -email -albums -images');

        res.status(200).json({remove, message:'Image removed from favourites successfully'});

    }catch(err){
       res.status(500).json({err:'Internal Server error'}); 
    }
}

module.exports = {
    uploadImage,
    // getFavImages,
    getImageInfo,
    addtoFav,
    removeFromFav,
    removeImg,
    getImgs

}