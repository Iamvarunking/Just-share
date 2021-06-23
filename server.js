require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000 ; 

const connectDB = require('./config/db') ;
connectDB();

const corsOption = {
    origin: "http://127.0.0.1:3000" 
}

app.use(cors(corsOption));

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