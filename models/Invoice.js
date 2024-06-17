// models/Invoice.js
const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

const invoiceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: generateInvoiceId
    },
    cartItems: [{
        detail: String,
        size: String,
        quantity: Number,
        price: Number,
        imageSrc: String
    }],
    clientName: {
        type: String,
        required: true
    },
    clientAddress: {
        type: String,
        required: true
    },
    totalDue: {
        type: Number,
        required: true
    },
    creationDateTime: {
        type: String,
        required: true,
        default: moment().tz('Asia/Hebron').format('YYYY-MM-DD hh:mm:ss A')
    },
    paymentStatus: {
        type: String,
        default: 'غير مدفوع'
    }
});
 
function generateInvoiceId() {
    return crypto.randomBytes(4).toString('hex');
}

const Invoice = mongoose.model('Invoice', invoiceSchema, 'Invoices');

module.exports = Invoice;
