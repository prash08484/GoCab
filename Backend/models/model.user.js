const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name should be minimum 3 character']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name should be minimum 3 character']
        }
    },
    email: {
        type: String,
        required: true,
        minlength: [10, 'Minimum length of mail is 10 '],
        unique: true,
    },
    password: {
        required: true,
        type: String,
        select: false // it ensure when we search for user then didn't share password
    },
    socketId: {
        type: String }
});

userSchema.methods.generateAuthTokens = function () {
    const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET,{expiresIn:'24h'});
    return token; }

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); }

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10); }

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;

