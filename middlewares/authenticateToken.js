// middlewares/authenticateToken.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.query.token;  

    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    jwt.verify(token, 'juNHYD5ttGD', (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Forbidden' });

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
