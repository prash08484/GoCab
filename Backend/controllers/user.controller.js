const userModel = require('../models/model.user');
const validationResults = require('express-validator');


module.exports.registerUser = async (req,res,next)=>{
// react to express-validation of routes 
const errors= validationResults(req);
if(!errors.isEmpty()){
    // there is any error in validation 

    return res.status(400).json({ errors:errors.array() }); 
    // errors.array contain msg that you pass with validator in routes 
}

}

// this used to create user 

