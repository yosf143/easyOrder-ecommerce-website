// routes/admincp.js
const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/admincp/login');
const dashboardController = require('../controllers/admincp/dashboard');
const userSettingsController = require('../controllers/admincp/userSettings');
const phoneNumberController = require('../controllers/admincp/phoneNo');
const ordersController = require('../controllers/admincp/orders');
const categoriesController = require('../controllers/admincp/categories');
const sizesController = require('../controllers/admincp/sizes');
const menuItemsController = require('../controllers/admincp/menuItems');
const itemcfgController = require('../controllers/admincp/itemcfg');
const couponsController = require('../controllers/admincp/coupons');
const clearbgController = require('../controllers/admincp/clearbg'); 

// Route for Admin Control Panel login page
router.get('/', LoginController.getLoginPage);

// Route to handle login POST request
router.post('/login', LoginController.handleLogin);

// Route for Admin Control Panel dashboard page (protected route)
router.get('/dashboard', dashboardController.getDashboardPage);

// Route for User Settings page
router.get('/usersettings', userSettingsController.getUserSettingsPage);
router.post('/usersettings/update', userSettingsController.updateUserSettings);

// Route for PhoneNumber page
router.get('/phonenumber', phoneNumberController.getPhoneNumberPage);
router.post('/phonenumber/update', phoneNumberController.updatePhoneNumber);

// Route for Orders page
router.get('/orders', ordersController.getOrdersPage);
router.post('/orders/delete/:orderId', ordersController.deleteOrder);
router.post('/orders/pay/:orderId', ordersController.changePaymentStatusPaid);
router.post('/orders/unpay/:orderId', ordersController.changePaymentStatusUnpaid);
router.post('/orders/bulkdelete', ordersController.bulkDeleteOrders);

// Route for Categories page
router.get('/categories', categoriesController.getCategoriesPage);
router.post('/categories/add', categoriesController.addCategory);
router.post('/categories/delete/:categoryName', categoriesController.deleteCategory);
router.post('/categories/updateSortNumber/:categoryName', categoriesController.updateSortNumber);

// Routes for Sizes page
router.get('/sizes', sizesController.getSizesPage);
router.post('/sizes/add', sizesController.addSize); 
router.post('/sizes/delete/:sizeName', sizesController.deleteSize);
router.post('/sizes/updateSortNumber/:sizeName', sizesController.updateSortNumber);

// Route for MenuItems page
router.get('/menuitems', menuItemsController.getMenuItemsPage);
router.get('/menuitems/add', menuItemsController.getAddItemPage);
router.post('/menuitems/add', menuItemsController.addItem);
router.get('/menuitems/edit/:id', menuItemsController.getEditItemPage);
router.post('/menuitems/edit/:id', menuItemsController.editItem);
router.post('/menuitems/delete/:id', itemcfgController.deleteMenuItem);
router.post('/menuitems/soldout/:id', itemcfgController.markAsSoldOut);
router.post('/menuitems/available/:id', itemcfgController.markAsAvailable);

// Route for Coupons page
router.get('/coupons', couponsController.getCouponsPage);
router.post('/coupons/add', couponsController.addCoupon);
router.post('/coupons/delete/:code', couponsController.deleteCoupon);

//Route for clearbg page
router.get('/clearbg', clearbgController.clearbgPage);

module.exports = router;
