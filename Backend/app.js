const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app=express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    try{

        console.log("get ");
        
        res.send("hello");
    }
    catch(err){
        console.log(err);
    }


})


module.exports = app;










