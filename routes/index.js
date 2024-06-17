// routes/index.js
const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();

const indexController = require('../controllers/frontend/index');
const  invoiceController = require('../controllers/frontend/viewOrder'); 
const paypalController = require('../controllers/frontend/paypal');
const cartController = require('../controllers/frontend/cart');
const menuController = require('../controllers/frontend/menu');
 
// Cart
router.get('/cart', cartController.getCartPage);
router.get('/menu', menuController.getItems);
router.post('/sendOrder', cartController.sendOrder);
router.post('/addtocart', cartController.addToCart);
router.post('/updatequantity', cartController.updateQuantity);

// Other
router.get('/', indexController.getItems);
router.get('/vieworder/:invoiceId?', invoiceController.viewOrder); 
router.get('/policy', indexController.policyPage);

// Payments
router.post('/paypal/:invoiceId', async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const totalDue = req.body.totalDue;
        const url = await paypalController.createOrder(totalDue, invoiceId);

        res.redirect(url);
    } catch (error) {
        res.send('Error: ' + error);
    }
});
router.get('/PaypalSuccess', async (req, res) => {
    try {
        const { token, invoiceId } = req.query;
        const captureResponse = await paypalController.capturePayment(token);
 
        const invoice = await Invoice.findById(invoiceId);
        if (invoice) {
            invoice.paymentStatus = 'مدفوع';
            await invoice.save();
        }

        res.render('./frontend/paypal/successPage', { details: captureResponse });
    } catch (error) {
        res.send('Error capturing payment: ' + error);
    }
});
router.get('/PaypalCancelled', paypalController.paymentCancel);
router.post('/pay-on-delivery', invoiceController.payOnDelivery);  
 

module.exports = router;
