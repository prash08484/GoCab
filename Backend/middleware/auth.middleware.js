
// middleware for login using : token  -> id -> user 

const { contextsKey } = require('express-validator/lib/base');
const userModel = require('../models/model.user');
const captainModel = require('../models/model.captain');
const jwt = require('jsonwebtoken');
const balckListTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined);

        if (!token) { // have not token  
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Check blacklisted 
        const isBlackListed = await balckListTokenModel.findOne({ token: token });
        if (isBlackListed) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET); // give id 

        // Find User 
        const user = await userModel.findById(decode._id); // using id find the user in db 
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports.authCaptain = async (req, res, next) => {

    try {

        // find the token 
        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined);

        if (!token) {
            console.log("token not found "); 
            return res.status(401).json({ message: "Unauthorized" });
        }

        // check is blacklisted token 
        const isBlackListed = await balckListTokenModel.findOne({ token: token });
        if (isBlackListed) {
            console.log("token blacklisted "); 
            return res.status(401).json({ message: "Unauthorized" });
        }

        // find id by jwt 
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // find the user by id 
        const captain = await captainModel.findById(decode._id);

        // check is user exist 
        if (!captain) {
            console.log("No use with id  "); 
            return res.status(401).json({ message: "Unauthorized" });
        }

        // send user as in res.
        req.captain = captain;
        next();

        // pass to next middleware 

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}