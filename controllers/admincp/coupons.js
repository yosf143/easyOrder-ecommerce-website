// controllers/admincp/coupons.js
const jwt = require('jsonwebtoken');  
const Coupon = require('../../models/Coupon');
 
function getCouponsPage(req, res) {
    const token = req.query.token;

    jwt.verify(token, 'juNHYD5ttGD', (err, user) => {
        if (err) {
            res.redirect('/admincp/?error=Unauthorized');
        } else {
            Coupon.find({})
                .then(coupons => {
                    res.render('./admincp/resources/coupons', { token: token, coupons: coupons, error: null });
                })
                .catch(err => {
                    console.error('Error fetching coupons:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                });
        }
    });
}


async function addCoupon(req, res) {
    const { code, percentage } = req.body;
    const token = req.query.token;

    try {
   
      

        const existingCoupon = await Coupon.findOne({ code: code });
        if (existingCoupon) {
            const coupons = await Coupon.find({});
            return res.render('./admincp/resources/coupons', { token: token, coupons: coupons, error: 'الكوبون مسجل بالفعل.' });
        }

        const newCoupon = new Coupon({ code: code, discountPercentage: percentage });
        await newCoupon.save();

  
        res.redirect(`/admincp/coupons?token=${token}`);
    } catch (err) {
        console.error('Error adding new coupon:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function deleteCoupon(req, res) {
    const code = req.params.code;
    const token = req.query.token;

    try {
        await Coupon.findOneAndDelete({ code: code });

         
  
        res.redirect(`/admincp/coupons?token=${token}`);
    } catch (err) {
        console.error('Error deleting coupon:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getCouponsPage,
    addCoupon,
    deleteCoupon
};
