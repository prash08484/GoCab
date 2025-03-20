// purpose of this file is to remove token after 24 hours of creation 
// so that databse no more filled with useless token

const mongoose = require('mongoose');
const blackListTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 86400 // time to live is 24 hours (TTL)
    }
});

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);