// controllers/frontend/viewOrder.js
const Invoice = require('../../models/Invoice');

async function viewOrder(req, res) {
    const invoiceId = req.params.invoiceId;

    if (!invoiceId) {
        return res.render('./frontend/resources/viewOrder', { 
            invoiceData: null, 
            invoiceId: null,
            errorMessage: 'يرجى إدخال رقم الطلب.' 
        });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            res.render('./frontend/resources/viewOrder', { 
                invoiceData: null, 
                invoiceId: null,
                errorMessage: 'رقم الطلب غير موجود أو قد تم حذفه تلقائياً.' 
            });
            return;
        }

        res.render('./frontend/resources/viewOrder', { 
            invoiceData: invoice, 
            invoiceId: invoiceId,
            errorMessage: null
        });
    } catch (err) {
        console.error('Error fetching invoice:', err);
        res.render('./frontend/resources/viewOrder', { 
            invoiceData: null, 
            invoiceId: null,
            errorMessage: 'حدث خطأ أثناء استرجاع الفاتورة.'
        });
    }
}
async function payOnDelivery(req, res) {
    const { invoiceId } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).send('Invoice not found');
        }

        invoice.paymentStatus = 'دفع عند الإستلام';
        await invoice.save();

        res.redirect(`/viewOrder/${invoiceId}`);
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { 
    viewOrder,
    payOnDelivery
};
