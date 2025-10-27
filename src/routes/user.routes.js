const express = require('express');
const router = express.Router();
const jwtauthmiddleware = require('../middlewares/jwt.middleware');
const {
    registerUser
} = require('../controllers/user.controller')

router.post('/register',registerUser);

module.exports = router;