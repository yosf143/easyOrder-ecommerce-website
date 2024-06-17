// controllers/admincp/menuItems.js
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');   
const MenuItem = require("../../models/MenuItem");
const Category = require("../../models/Category");
const Size = require("../../models/Size");
const multer = require("multer");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/Frontend/img/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    return cb(new Error("User tried to upload invalid image format"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { files: 3 }  
}).array("images", 3);

function getMenuItemsPage(req, res) {
  const token = req.query.token;

  jwt.verify(token, 'juNHYD5ttGD', (err, user) => {
      if (err) {
          res.redirect('/admincp/?error=Unauthorized');
      } else {
          MenuItem.find()
              .then(menuItems => {
                  res.render("./admincp/menu/menuItems", {
                      menuItems: menuItems,
                      token: token,
                  });
              })
              .catch(err => {
                  console.error("Error fetching menu items:", err);
                  res.status(500).json({ message: "Internal Server Error" });
              });
      }
  });
}


function getAddItemPage(req, res) {
  const token = req.query.token;
  const errorMessage = req.query.errorMessage || null;

  jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
    if (err) {
      res.redirect('/admincp/?error=Unauthorized');
    } else {
      try {
        const categories = await Category.find().sort({ sortNumber: 1 });
        const sizes = await Size.find().sort({ sortNumber: 1 });
        
        res.render("./admincp/menu/addItem", {
          categories: categories,
          sizes: sizes,
          token: token,
          errorMessage: errorMessage,
        });
      } catch (err) {
        console.error("Error fetching categories and sizes:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
}

function getEditItemPage(req, res) {
  const token = req.query.token;
  const itemId = req.params.id;
  const errorMessage = req.query.errorMessage || null;

  jwt.verify(token, 'juNHYD5ttGD', async (err, user) => {
    if (err) {
      res.redirect('/admincp/?error=Unauthorized');
    } else {
      try {
        const item = await MenuItem.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: "Item not found" });
        }

        const categories = await Category.find().sort({ sortNumber: 1 });
        const sizes = await Size.find().sort({ sortNumber: 1 });

        res.render("./admincp/menu/editItem", {
          item: item,
          categories: categories,
          sizes: sizes,
          token: token,
          errorMessage: errorMessage
        });
      } catch (err) {
        console.error("Error fetching item, categories, and sizes:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
}

async function editItem(req, res) {
  const token = req.query.token;
  const itemId = req.params.id;

  upload(req, res, async function (err) {
      if (err) {
          console.error("Error uploading file:", err);
          return res.redirect(`/admincp/menuitems/edit/${itemId}?token=${token}&errorMessage=حدثت مشكلة في تعديل المنتج: `);
      }

      const category = req.body.category;
      const name = req.body.name;
      const sizes = req.body.sizes || [];
      const sizePrice = req.body.sizePrice || {};
      const decodedSizePrice = {};
      Object.keys(sizePrice).forEach((key) => {
          const decodedKey = decodeURIComponent(key);
          decodedSizePrice[decodedKey] = sizePrice[key];
      });

      const sizesWithPrices = sizes.map((size) => ({
          name: size,
          price: decodedSizePrice[size] || 0,
      }));

      try {
    
 
          const existingItem = await MenuItem.findById(itemId);
      
          if (req.files.length > 0) {
     
              const imageSrc = req.files.map((file) => ({
                  url: "Frontend/img/products/" + file.filename,
                  uuid: uuidv4()
              }));
              
            
              existingItem.imageSrc.forEach((image) => {
                  fs.unlinkSync(path.join(__dirname, "..", "..", "public", image.url));
              });
              
           
              existingItem.imageSrc = imageSrc;
          }
 
          existingItem.category = category;
          existingItem.name = name;
          existingItem.sizes = sizesWithPrices;
 
          await existingItem.save();

          res.redirect(`/admincp/menuitems?token=${token}`);
      } catch (err) {
          console.error("Error editing menu item:", err);
          res.status(500).json({ message: "Internal Server Error" });
      }
  });
}



function addItem(req, res) {
  const token = req.query.token;

  upload(req, res, async function (err) {
    if (err) {
      console.error("Error uploading file:", err);
      return res.redirect(`/admincp/menuitems/add?token=${token}&errorMessage=لا يمكن إضافة أكثر من 3 صور للمنتج.`);
    }

    const category = req.body.category;
    const name = req.body.name;
    const sizes = req.body.sizes || [];
    const sizePrice = req.body.sizePrice || {};
    const decodedSizePrice = {};
    Object.keys(sizePrice).forEach((key) => {
      const decodedKey = decodeURIComponent(key);
      decodedSizePrice[decodedKey] = sizePrice[key];
    });

    const sizesWithPrices = sizes.map((size) => ({
      name: size,
      price: decodedSizePrice[size] || 0,
    }));
 
    const imageSrc = req.files.map((file) => ({
      url: "Frontend/img/products/" + file.filename,
      uuid: uuidv4()
    }));

    const id = uuidv4();

    const menuItem = new MenuItem({
      _id: id,
      category: category,
      name: name,
      sizes: sizesWithPrices,
      imageSrc: imageSrc, 
    });

    try {
 
      await menuItem.save();

      res.redirect(`/admincp/menuitems?token=${token}`);
    } catch (err) {
      console.error("Error adding new menu item:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}
 
module.exports = {
  getMenuItemsPage,
  getEditItemPage,
  getAddItemPage,
  editItem,
  addItem
 
};
