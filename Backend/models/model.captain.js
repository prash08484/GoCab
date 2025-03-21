// Contain info for a CAPTAIN in DB 

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First Name must be atleast 3 character long ']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last Name must be atleast 3 character long ']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [6, 'Password must be atleast 6 character long ']
    },
    password: {
        type: String,
        required: true
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        // color vechiletype plate capacity 
        color: {
            type: String,
            minlength: [3, 'Color must be atleast be 3 character long '],
            required: true
        },
        plate: {
            type: String,
            minlength: [3, 'Length must be atleast 3 character long '],
            required: true,
            unique: true,
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['motorcycle', 'car', 'auto']
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be atleast 1']
        }
    },
    location:{
        lat:{
            type:Number},
        lng:{
            type:Number, 
        }
    }
});

captainSchema.methods.generateAuthTokens = function () {
    return jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const captianModel = mongoose.model('captain', captainSchema);
module.exports = captianModel;

