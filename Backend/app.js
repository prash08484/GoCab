const dotenv = require('dotenv'); // to store variable that's you don't want to be public
dotenv.config();
const express = require('express');
const cors = require('cors'); // cross operation resource sharing 
const app = express();
const connectToDB = require('./db/db');
connectToDB();
const userRoutes = require('./routes/user.routes');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// This middleware parses incoming request bodies with 
// URL-encoded data (typically from HTML forms) and makes 
// it available under req.body.


app.get('/', (req, res) => {
    try {
        console.log("get ");
        res.send("hello working ");
    }
    catch (err) {
        console.log(err);
    }
});

app.use('/user', userRoutes);


module.exports = app;










