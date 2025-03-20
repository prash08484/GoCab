
// middleware for login using : token  -> id -> user 

const userModel = require('../models/model.user');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined);

        if (!token) { // have not token 
            console.log("Not have token ");
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Check blacklisted 
        const isBlackListed = await userModel.findOne({ token: token });
        if (isBlackListed) {
            console.log("blacklisted ");
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("Else errro ");

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
            message: "Unauthorized",
            Error: err
        });
    }
}