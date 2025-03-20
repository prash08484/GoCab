const userModel = require('../models/model.user');
const userServices = require('../services/user.services');
const { validationResult } = require('express-validator');

// this used to create user  
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

    const token = user.generateAuthTokens(user);
    res.status(201).json({ user, token });

}

// login user 
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    // checking email exist in db or not 
    const user = await userModel.findOne({ email }).select('+password');
    
    if (!user) {
        res.status(401).json({ message: "Invalid email or Password " });
    }
    
    // checking respective email , pass is match or not  
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or Password " });
    }
   
    // everything is ok 
    const token = user.generateAuthTokens();
    res.status(200).json({ token, user });

}

