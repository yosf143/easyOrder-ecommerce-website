// models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountPercentage: {
        type: Number,
        required: true
    }
});
 
const Coupon = mongoose.model('Coupon', couponSchema, 'coupons');

module.exports = Coupon;
