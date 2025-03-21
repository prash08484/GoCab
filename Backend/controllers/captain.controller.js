const captainModel = require('../models/model.captain');
const { validationResult } = require('express-validator');
const captainServices = require('../services/captain.service');
const middleware = require('../middleware/auth.middleware');
const blacklistTokenModel = require('../models/blacklistToken.model');


module.exports.registerCaptain = async (req, res, next) => {

    // check error 
    const errors = validationResult(req); // send the req. to validation
    if (!errors.isEmpty()) {
        console.log("some error have encounterd ");
        return res.status(400).json({ errors: errors.array() });
    }

    // parse body for info  
    const { fullname, email, password, vehicle } = req.body;

    // check is email or plate already exist 
    const isAlreadyExist = await captainModel.findOne({ email }) || await captainModel.findOne({ "vehicle.plate": vehicle.plate });

    if (isAlreadyExist) {
        console.log("captian already exists ");
        return res.status(400).json({ message: "Captain Already Exists" });
    }

    console.log("created some captain ");

    // hash password 
    const hashedPassword = await captainModel.hashPassword(password);
    // create 
    const captain = await captainServices.createCaptain({
        firstname: fullname.firstname, lastname: fullname.lastname,
        password: hashedPassword,
        email,
        color: vehicle.color, plate: vehicle.plate, capacity: vehicle.capacity, vehicleType: vehicle.vehicleType,
    });

    const token = captain.generateAuthTokens();
    res.status(200).json({ captain, token });
}

module.exports.loginCaptain = async (req, res, next) => {
    
    // check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    // find the captain by email 
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: "Invalid email or password " });
    }

    // cmp pass 
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        // pass not match 
        return res.status(401).json({ message: "Invalid email or password " });
    }

    // everything is ok 

    // generate token 
    const token = captain.generateAuthTokens();
    
    // return response with token as cookie 
    res.status(200).cookie('token', token).json({token, captain});
}

module.exports.getCaptainProfile = async (req, res, next) => {
    // use middleware for authtecation 
    res.status(200).json({captain:req.captain});
}
module.exports.logoutCaptain = async (req, res, next) => {
    try {
        // extract token 
        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined);
         
        // clear token 
         res.clearCookie('token'); // removing single cookie so cookie not cookies 

        //  black list current token 
        await blacklistTokenModel.create({ token });

        // send res.
        res.status(200).json({ message: "Logged Out" });
    }
    catch (err) {
        res.status(501).json({ message: "Error logging Out" });
    }
}
