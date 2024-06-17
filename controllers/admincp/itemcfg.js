// controllers/admincp/itemcfg.js
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');   
const MenuItem = require("../../models/MenuItem");
 
 
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
function deleteMenuItem(req, res) {
  const token = req.query.token;
  const id = req.params.id;

  MenuItem.findByIdAndDelete(id)
    .then(async (deletedMenuItem) => {
      deletedMenuItem.imageSrc.forEach((image) => {
        deleteImageFile(image.url);  
      });

      try {
     
        res.redirect(`/admincp/menuitems?token=${token}`);
      } catch (err) {
        console.error("Error logging delete action:", err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })
    .catch((err) => {
      console.error("Error deleting menu item:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
}


function deleteImageFile(imageSrc) {
  if (imageSrc) {
    const imagePath = path.join(__dirname, "../../public", imageSrc);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      } else {
        console.log("Image file deleted successfully:", imagePath);
      }
    });
  }
}

async function markAsSoldOut(req, res) {
  const token = req.query.token;
  const itemId = req.params.id;

  try {
 
 
 
    const menuItem = await MenuItem.findByIdAndUpdate(itemId, { soldOut: true }, { new: true });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

 
    res.redirect(`/admincp/menuitems?token=${token}`);
  } catch (err) {
    console.error("Error marking menu item as sold out:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function markAsAvailable(req, res) {
  const token = req.query.token;
  const itemId = req.params.id;

  try {
  
 
    const menuItem = await MenuItem.findByIdAndUpdate(itemId, { soldOut: false }, { new: true });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
 
    res.redirect(`/admincp/menuitems?token=${token}`);
  } catch (err) {
    console.error("Error marking menu item as available:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getMenuItemsPage,
  deleteMenuItem,
  markAsAvailable,
  markAsSoldOut
};
