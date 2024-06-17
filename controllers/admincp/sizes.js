// controllers/admincp/sizes.js
const jwt = require('jsonwebtoken'); 
const fs = require('fs');
const Size = require('../../models/Size');
const MenuItem = require('../../models/MenuItem');
 
async function getSizesPage(req, res) {
    const token = req.query.token;
    let errorMessage = "";
    if (req.query.errorMessage) {
        errorMessage = req.query.errorMessage;
    }

    jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
        if (err) {
            res.redirect('/admincp/?error=Unauthorized');
        } else {
            try {
               
                const sizes = await Size.find().sort({ sortNumber: 1 });
                res.render('./admincp/resources/sizes', { sizes: sizes, token: token, errorMessage: errorMessage });
            } catch (err) {
                console.error('Error fetching sizes:', err);
                res.status(500).json({ message: 'Oops! Internal Server Error.' });
            }
        }
    });
}


async function deleteSize(req, res) {
    const sizeName = req.params.sizeName;
    const token = req.query.token;

    try {
 
        const sizeUsed = await MenuItem.exists({ 'sizes.name': sizeName });
        if (sizeUsed) {
            return res.redirect(`/admincp/sizes?token=${token}&errorMessage=${encodeURIComponent('لا يمكن حذف هذا الحجم لانه مستخدم في قائمة الأصناف.')}`);
        } else {
            await Size.findOneAndDelete({ name: sizeName });
 
       
            res.redirect(`/admincp/sizes?token=${token}`);
        }
    } catch (err) {
        console.error('Error deleting size:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}

async function addSize(req, res) {
    const { sizeName } = req.body;
    const token = req.query.token;

    try {
        const decodedToken = jwt.verify(token, 'juNHYD5ttGD');
      
    
        const sizes = await Size.find();
        const sortNumber = sizes.length + 1;

        const sizeExists = await Size.exists({ name: sizeName });
        if (sizeExists) {
            return res.redirect(`/admincp/sizes?token=${token}&errorMessage=${encodeURIComponent('هذا الحجم مسجل من قبل, يرجى إختيار اسم اخر.')}`);
        } else {
            const newSize = new Size({ name: sizeName, sortNumber: sortNumber });
            await newSize.save();
 
            res.redirect(`/admincp/sizes?token=${token}`);
        }
    } catch (err) {
        console.error('Error adding size:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}

async function updateSortNumber(req, res) {
    const sizeName = req.params.sizeName;
    let newIndex = parseInt(req.query.index) + 1; 

    try {
        
        await Size.findOneAndUpdate({ name: sizeName }, { sortNumber: newIndex });

        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating sort number:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}



module.exports = {
    getSizesPage,
    deleteSize,
    updateSortNumber,
    addSize
};
