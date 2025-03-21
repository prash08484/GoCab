const captainModel = require('../models/model.captain');

module.exports.createCaptain = async (
    { firstname, lastname, password, email, vehicleType, color, capacity, plate }) => {

    if (!firstname || !password || !email || !color || !capacity || !plate || !vehicleType) {
        console.log(firstname, password, email, color, capacity, plate, vehicleType);
        throw new Error("All Fields are required ");
    }

    // create captain

    const captain = captainModel.create({
        fullname: { firstname, lastname },
        email,
        password,
        vehicle: {color, plate,vehicleType,capacity}
    });
    return captain;
}








