// controllers/admincp/orders.js
const path = require('path');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');  
const Invoice = require('../../models/Invoice');

 

async function getOrdersPage(req, res) {
    const token = req.query.token;
    const host = req.get('host');

    jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
        if (err) {
            res.redirect('/admincp/?error=Unauthorized');
        } else {
            try {
                const invoices = await Invoice.find().sort({ creationDateTime: -1 });
                const orders = [];

                for (const invoice of invoices) {
                

                    const order = {
                        id: invoice._id,
                        clientName: invoice.clientName,
                        creationDateTime: new Date(invoice.creationDateTime).toLocaleString(),
                        totalDue: invoice.totalDue,
                        paymentStatus: invoice.paymentStatus,
                       
                    };

                    orders.push(order);
                }

                res.render('./admincp/dash/orders', { orders, totalInvoices: invoices.length, token, host });
            } catch (err) {
                console.error('Error fetching invoices:', err);
                res.status(500).json({ message: 'Oops! Internal Server Error.' });
            }
        }
    });
}

async function deleteOrder(req, res) {
    const orderId = req.params.orderId;
    const token = req.query.token;
    jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
        if (err) {
            return res.redirect('/admincp/?error=Unauthorized');
        }

        try {
         
            const deletedInvoice = await Invoice.findByIdAndDelete(orderId);
            if (!deletedInvoice) {
                console.warn('Invoice not found:', orderId);
                return res.status(404).json({ message: 'Invoice not found' });
            }

            console.log('Invoice deleted:', orderId);
            res.redirect(`/admincp/orders?token=${token}`);
        } catch (err) {
            console.error('Error deleting invoice:', err);
            res.status(500).json({ message: 'Oops! Internal Server Error.' });
        }
    });
}


function changePaymentStatusPaid(req, res) {
    const orderId = req.params.orderId;
    const token = req.query.token;

    Invoice.findByIdAndUpdate(orderId, { paymentStatus: 'مدفوع' })
        .then(async () => {
            const decodedToken = jwt.verify(token, 'juNHYD5ttGD');
          

        
            res.redirect(`/admincp/orders?token=${token}`);
        })
        .catch(err => {
            console.error('Error updating payment status:', err);
            res.status(500).json({ message: 'Oops! Internal Server Error.' });
        });
}

function changePaymentStatusUnpaid(req, res) {
    const orderId = req.params.orderId;
    const token = req.query.token;

    Invoice.findByIdAndUpdate(orderId, { paymentStatus: 'غير مدفوع' })
        .then(async () => {
            const decodedToken = jwt.verify(token, 'juNHYD5ttGD');
          
 
     
            res.redirect(`/admincp/orders?token=${token}`);
        })
        .catch(err => {
            console.error('Error updating payment status:', err);
            res.status(500).json({ message: 'Oops! Internal Server Error.' });
        });
}

async function bulkDeleteOrders(req, res) {
    const { ids, token } = req.body;
 
    jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
        if (err) {
        
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        try {
        
            await Promise.all(ids.map(async (id) => {
                const deletedInvoice = await Invoice.findByIdAndDelete(id);

                if (!deletedInvoice) {
                    console.warn(`Invoice not found for ID: ${id}`);
                    return; 
                }
            }));

            res.json({ success: true, message: 'Invoices deleted successfully' });
        } catch (err) {
            console.error('Error deleting selected invoices:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });
}

module.exports = {
    getOrdersPage,
    deleteOrder,
    bulkDeleteOrders,
    changePaymentStatusPaid,
    changePaymentStatusUnpaid
};
