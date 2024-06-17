//models/PhoneNo.js
const mongoose = require('mongoose');

const phoneNoSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    }
});

const PhoneNo = mongoose.model('PhoneNo', phoneNoSchema, 'PhoneNo');

module.exports = PhoneNo;
