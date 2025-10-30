const express = require('express');
const router = express.Router();
const jwtauthmiddleware = require('../middlewares/jwt.middleware');
const upload = require('../middlewares/multer.middleware');

const {
    uploadImage,
    // getFavImages,
    getImageInfo,
    addtoFav,
    removeFromFav,
    removeImg,
    getImgs
    
} = require('../controllers/image.controller')

router.post('/upload',jwtauthmiddleware, upload.array('photos',5), uploadImage);
router.get('/get-images',jwtauthmiddleware,getImgs);
router.put('/add-to-favourites',jwtauthmiddleware,addtoFav);
// router.get('/get-fav-images',jwtauthmiddleware,getFavImages);
router.get('/get-image-info',jwtauthmiddleware,getImageInfo);

router.delete('/remove-img', jwtauthmiddleware,removeImg);
router.delete('/remove-from-fav', jwtauthmiddleware,removeFromFav);

module.exports = router;