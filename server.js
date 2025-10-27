const app = require('./app')
require('dotenv').config();

const port = process.env.PORT;

const connectDB = require('./src/config/db');
connectDB().then(()=>{
    app.on('error',(err)=>{
        console.log('Error:',err);
        throw err;
    })

    app.listen(port, ()=>{
        console.log(`example app listening on ${port}`);
    })

}).catch((err)=>{
    console.log('Error in connection to MongoDB server',err);
})

const userRoutes = require('./src/routes/user.routes');
app.use('/user',userRoutes);


app.get('/', (req,res)=>{
    res.send('Server is live')
})