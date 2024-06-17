// controllers/frontend/menu.js
const MenuItem = require('../../models/MenuItem');
const Size = require('../../models/Size');

async function getItems(req, res) {
    try {
 
        const menuItems = await MenuItem.find().lean();
 
        const sizes = await Size.find().sort({ sortNumber: 1 }).lean();
        const sizeSortOrder = sizes.reduce((acc, size) => {
            acc[size.name] = size.sortNumber;
            return acc;
        }, {});

        
        menuItems.forEach(item => {
            if (item.sizes && item.sizes.length) {
                item.sizes.sort((a, b) => {
                    const sortA = sizeSortOrder[a.name] || 0; 
                    const sortB = sizeSortOrder[b.name] || 0;
                    return sortA - sortB;
                });
            }
        });
 
        const cartCount = req.session.cart ? req.session.cart.reduce((total, item) => total + item.quantity, 0) : 0;
 
        res.render('./frontend/resources/menu', { menuItems, cartCount });
    } catch (err) {
        res.status(500).send('خطأ في الوصول لقاعدة البيانات');
    }
}

module.exports = {
    getItems
};
