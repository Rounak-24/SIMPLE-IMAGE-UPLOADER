const express = require('express');
const app = express();

require('dotenv').config();

const bodyParser = require('body-parser');;
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

const logRequest = (req,res,next)=>{
    console.log(`${new Date().toLocaleString()} request made to : ${req.originalUrl}`);
    next();
}
app.use(logRequest);

module.exports = app;