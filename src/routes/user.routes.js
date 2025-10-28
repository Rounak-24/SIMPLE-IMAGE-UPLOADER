const express = require('express');
const router = express.Router();
const jwtauthmiddleware = require('../middlewares/jwt.middleware');
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getProfile
} = require('../controllers/user.controller')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',jwtauthmiddleware, logoutUser);
router.post('/refresh-access-token', refreshAccessToken);
router.get('/get-profile', jwtauthmiddleware, getProfile);

module.exports = router;