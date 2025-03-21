const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');

router.post('/register', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First Name must be atleast 3 character long'),
    body('password').isLength({ min: 3 }).withMessage('Password must be atleast 3 character long '),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be atleast 3 character long '),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Type of vehicle Should be Valid '),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be atleast 3 character long '),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be atleast 1  '),
],
    captainController.registerCaptain
);


module.exports = router;
 