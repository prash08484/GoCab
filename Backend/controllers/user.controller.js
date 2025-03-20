const userModel = require('../models/model.user');
const userServices = require('../services/user.services');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

//  to create user  
module.exports.registerUser = async (req, res, next) => {
    // react to express-validation of routes 
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // there is any error in validation 
        return res.status(400).json({ errors: errors.array() });
        // errors.array contain msg that you pass with validator in routes 
    }
    // every thing is fine so create user 

    const { fullname, password, email } = req.body;
    // hash the password before using it 
    const hashedPassword = await userModel.hashPassword(password);

    // finally create a real user  

    const user = await userServices.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthTokens();
    res.status(201).json({ user, token });

}

// to login user 
module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    // checking email exist in db or not 
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: "Invalid email or Password " });
    }

    // checking respective email , pass is match or not  
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or Password " });
    }

    // everything is ok 
    const token = user.generateAuthTokens();
    res.status(200).cookie('token', token).json({ token, user });
    // login then attach cookies with it 
}

// to fetch profile
module.exports.getUserProfile = async (req, res, next) => {
    // use middleware auth to find user using current token 
    res.status(200).json(req.user);
}

// to logout user 
module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined);
        await blackListTokenModel.create({ token });
        res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
}


 

