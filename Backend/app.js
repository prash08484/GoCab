const dotenv = require('dotenv'); // to store variable that's you don't want to be public
dotenv.config();
const express = require('express');
const cors = require('cors'); // cross operation resource sharing 
const app=express();
const connectToDB = require('./db/db');
connectToDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    try{

        console.log("get ");
        
        res.send("hello working ");
    }
    catch(err){
        console.log(err);
    }


})


module.exports = app;










