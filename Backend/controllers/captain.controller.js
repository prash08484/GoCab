const captainModel = require('../models/model.captain');
const { validationResult } = require('express-validator');
const captainServices = require('../services/captain.service')

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


