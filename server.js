require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000 ; 

const connectDB = require('./config/db') ;
connectDB();

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin" , "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    next();
});


app.set('views', path.join(__dirname, '/views'));
app.set('view engine' , 'ejs');
app.use(express.json());

app.use('/api/files' , require('./routes/files'));
app.use('/files' , require('./routes/show'));
app.use('/files/download' , require('./routes/download'));
app.use(express.static('public'));

app.listen(PORT, ()=>{
    console.log(`listing on port ${PORT}`);
})