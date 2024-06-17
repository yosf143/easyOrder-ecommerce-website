// models/Size.js
const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    sortNumber: {
        type: Number,
        required: true
    }
});

 
const Size = mongoose.model('Size', sizeSchema, 'sizes');

module.exports = Size;
