const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');

// express-validator is used to validate data that filled up

router.post('/register', [
    body('email').isEmail().withMessage("Invalid Eamil"),
    body('password').isLength({ min: 6 }).withMessage(
        "Minimum length of Password should be 6"),
    body('fullname.firstname').isLength({ min: 3 }).withMessage(
        "Minimum length of char should be 3"),
],
// if any thing happen then you can react below module function : userController.registerUser
    userController.registerUser
);


module.exports = router;