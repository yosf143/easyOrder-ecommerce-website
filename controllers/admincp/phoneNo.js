// controllers/admincp/phoneNo.js
const jwt = require('jsonwebtoken');
const PhoneNo = require('../../models/PhoneNo');
 
function getPhoneNumberPage(req, res) {
    const token = req.query.token;

    jwt.verify(token, 'juNHYD5ttGD', (err, user) => {
        if (err) {
            res.redirect('/admincp/?error=Unauthorized');
        } else {
            PhoneNo.findOne()
                .then(phone => {
                    const currentPhoneNumber = phone ? phone.number : '';
                    res.render('./admincp/account/phoneNumber', { currentPhoneNumber, token, error: null });
                })
                .catch(err => {
                    console.error('Error reading phone number:', err);
                    res.status(500).json({ message: 'Oops! Internal Server Error.' });
                });
        }
    });
}


async function updatePhoneNumber(req, res) {
    const { prefix, newPhoneNumber } = req.body;
    const token = req.query.token;
    const phoneNumberRegex = /^[0-9]+$/;

    if (!newPhoneNumber || !phoneNumberRegex.test(newPhoneNumber)) {
        return res.render('./admincp/account/phoneNumber', { currentPhoneNumber: '', token, error: 'يرجى إدخال رقم الـ Whatsapp بشكل صحيح' });
    }

    try {
        const decodedToken = jwt.verify(token, 'juNHYD5ttGD');

        const fullPhoneNumber = prefix + newPhoneNumber;

        await PhoneNo.findOneAndUpdate({}, { number: fullPhoneNumber }, { new: true, upsert: true });
        res.redirect(`/admincp/dashboard?token=${token}`);
    } catch (err) {
        console.error('Error updating phone number:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}

module.exports = {
    getPhoneNumberPage,
    updatePhoneNumber
};
