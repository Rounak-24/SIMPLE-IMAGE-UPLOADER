const express = require('express');
const router = express.Router();
const jwtauthmiddleware = require('../middlewares/jwt.middleware');
const upload = require('../middlewares/multer.middleware');

const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getProfile,
    changePassword,
    updateProfile,
    updateUserAvatar
    
} = require('../controllers/user.controller')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',jwtauthmiddleware, logoutUser);
router.post('/refresh-access-token', refreshAccessToken);
router.get('/get-profile', jwtauthmiddleware, getProfile);
router.post('/change-password', jwtauthmiddleware, changePassword);
router.patch('/update-profile', jwtauthmiddleware, updateProfile);

router.post('/update-avatar', jwtauthmiddleware, upload.single("avatar"), updateUserAvatar);

module.exports = router;