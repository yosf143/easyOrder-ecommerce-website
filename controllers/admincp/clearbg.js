//controllers/admincp/clearbg.js
const jwt = require('jsonwebtoken');

function clearbgPage(req, res) {
    const token = req.query.token;

    jwt.verify(token, 'juNHYD5ttGD', (err, user) => {
        if (err) {
            
            return res.status(401).redirect('/admincp/?error=Unauthorized');
        } else {
           
            return res.render("./admincp/clearbg", { token: token });
        }
    });

}

module.exports = {
    clearbgPage
};
