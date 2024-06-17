// models/MenuItem.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  }
});

const menuItemSchema = new mongoose.Schema({
    _id: {
        type: String, 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sizes: [{
        name: String,
        price: Number
    }],
    imageSrc: [imageSchema],   
    soldOut: {
        type: Boolean,
        default: false 
    }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema, 'menuItems');

module.exports = MenuItem;
