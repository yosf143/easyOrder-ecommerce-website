// controllers/frontend/paypal.js
require('dotenv').config();
const axios = require('axios');
const Invoice = require('../../models/Invoice');

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET,
        }
    });

    return response.data.access_token;
}

async function createOrder(totalDue, invoiceId) {
    const accessToken = await generateAccessToken();
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'ILS',
                    value: totalDue
                }
            }],
            application_context: {
                return_url: `${process.env.APP_BASE_URL}/PaypalSuccess?invoiceId=${invoiceId}`,
                cancel_url: process.env.APP_BASE_URL + '/PaypalCancelled',
                shipping_preference: 'NO_SHIPPING',
                brand_name: 'easyOrder',
                user_action: 'PAY_NOW'
            }
        })
    });

    return response.data.links.find(link => link.rel === 'approve').href;
}

async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    return response.data;
}


function paymentCancel(req, res) {
    res.render('./frontend/paypal/cancelPage');
}

module.exports = {
    createOrder,
    paymentCancel,
    capturePayment
};
