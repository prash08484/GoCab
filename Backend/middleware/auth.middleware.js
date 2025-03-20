
// middleware for login using : token  -> id -> user 

const userModel = require('../models/model.user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined);

        if (!token) { // have not token 
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // decode token using jwt decode 
        const decode = jwt.verify(token, process.env.JWT_SECRET); // give id 
        const user = await userModel.findById(decode._id); // using id find the user in db 
        req.user = user;
        next();
    }
    catch (err) {
       return res.status(401).json({
            message: "Unauthorized"
        });
    }

}