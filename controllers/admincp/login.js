// controllers/admincp/login.js
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

function getLoginPage(req, res) {
    res.render('./admincp/account/login', { error: null });
}

async function handleLogin(req, res) {
    const { email, password } = req.body; 
    try {
        const user = await User.findOne({ email }); 

        if (!user || password !== user.password) {
            return res.render('./admincp/account/login', { error: 'بيانات تسجيل الدخول غير صحيحة' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'juNHYD5ttGD', { expiresIn: '1h' }); 

        res.redirect(`/admincp/dashboard?token=${token}`);
    } catch (err) {
   
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getLoginPage,
    handleLogin
};
