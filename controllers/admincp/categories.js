// controllers/admincp/categories.js
const jwt = require('jsonwebtoken'); 
const Category = require('../../models/Category');
const MenuItem = require('../../models/MenuItem');
 

async function getCategoriesPage(req, res) {
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
                
                const categories = await Category.find().sort({ sortNumber: 1 });
                res.render('./admincp/resources/categories', { categories: categories, token: token, errorMessage: errorMessage });
            } catch (err) {
                console.error('Error fetching categories:', err);
                res.status(500).json({ message: 'Oops! Internal Server Error.' });
            }
        }
    });
}

async function deleteCategory(req, res) {
    const categoryName = req.params.categoryName;
    const token = req.query.token;

    try {
        const decodedToken = jwt.verify(token, 'juNHYD5ttGD');
      

        const categoryUsed = await MenuItem.exists({ category: categoryName });
        if (categoryUsed) {
            return res.redirect(`/admincp/categories?token=${token}&errorMessage=${encodeURIComponent('لا يكن حذف هذه المجموعة لانها مستخدمة في قائمة المنتجات.')}`);
        } else {
            await Category.findOneAndDelete({ name: categoryName });
 
            res.redirect(`/admincp/categories?token=${token}`);
        }
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}

async function addCategory(req, res) {
    const { categoryName } = req.body;
    const token = req.query.token;

    try {
        const decodedToken = jwt.verify(token, 'juNHYD5ttGD');
    
        const categories = await Category.find();
        const sortNumber = categories.length + 1;  

        const categoryExists = await Category.exists({ name: categoryName });
        if (categoryExists) {
            return res.redirect(`/admincp/categories?token=${token}&errorMessage=${encodeURIComponent('هذه المجموعة مسجلة من قبل, يرجى إختيار اسم آخر.')}`);
        } else {
            const newCategory = new Category({ name: categoryName, sortNumber: sortNumber });
            await newCategory.save();

            res.redirect(`/admincp/categories?token=${token}`);
        }
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}


async function updateSortNumber(req, res) {
    const categoryName = req.params.categoryName;
    let newIndex = parseInt(req.query.index) + 1;  

    try {
       
        await Category.findOneAndUpdate({ name: categoryName }, { sortNumber: newIndex });

        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating sort number:', err);
        res.status(500).json({ message: 'Oops! Internal Server Error.' });
    }
}

module.exports = {
    getCategoriesPage,
    deleteCategory,
    updateSortNumber,
    addCategory
};
