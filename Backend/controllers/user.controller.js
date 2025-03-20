const userModel = require('../models/model.user');
const userServices = require('../services/user.services');
const {validationResult} = require('express-validator');

// console.log(validationResults)
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
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    });

    const token = user.generateAuthTokens(user);
    res.status(201).json({ user, token });

}

// this used to create user 

