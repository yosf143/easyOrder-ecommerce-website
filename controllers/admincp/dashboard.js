// controllers/admincp/dashboard.js
const jwt = require('jsonwebtoken');

 
function getDashboardPage(req, res) {
    const token = req.query.token;

    jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
        if (err) {
            res.redirect('/admincp/?error=Unauthorized');
        } else {
            try {
             
           
                res.render('./admincp/dash/dashboard', { 
                    username: user.username, 
                    token: token, 
        
                });
            } catch (error) {
        
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    });
}

module.exports = {
    getDashboardPage
};
