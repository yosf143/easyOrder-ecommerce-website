// controllers/userSettings.js
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

function getUserSettingsPage(req, res) {
    const token = req.query.token;

    jwt.verify(token, 'juNHYD5ttGD', (err, user) => {
        if (err) {
            res.redirect('/admincp/?error=Unauthorized');
        } else {
            res.render('./admincp/account/userSettings', { token: token, error: null });
        }
    });
}

async function updateUserSettings(req, res) {
    const { currentPassword, email, password } = req.body; 
    const token = req.query.token;

    if (!currentPassword || !email || !password) { 
        return res.render('./admincp/account/userSettings', { token: token, error: 'يرجى ملء جميع الحقول' });
    }

    try {
        const decodedToken = jwt.verify(token, 'juNHYD5ttGD');
        const currentEmail = decodedToken.email;

        const user = await User.findOne({ email: currentEmail });

        if (!user) {
            return res.render('./admincp/account/userSettings', { token: token, error: 'User not found' });
        }

        if (user.password !== currentPassword) {
            return res.render('./admincp/account/userSettings', { token: token, error: 'كلمة المرور الحالية غير صحيحة' });
        }

        user.email = email;
        user.password = password;

        await user.save();

        const newToken = jwt.sign({ email: email }, 'juNHYD5ttGD', { expiresIn: '1h' });

        res.redirect(`/admincp/dashboard?token=${newToken}`);
    } catch (err) {
        console.error('Error updating user settings:', err);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Oops! Internal Server Error.' });
        }
    }
}

module.exports = {
    getUserSettingsPage,
    updateUserSettings
};
