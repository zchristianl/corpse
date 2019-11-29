const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Register From
router.get('/register', userController.register_get);

// Register process
router.post('/register', userController.validate('createUser'), userController.register_post);

// Login form
router.get('/login', userController.login_get);

// Login process
router.post('/login', userController.login_post);

// Logout
router.get('/logout', userController.logout_post);

// Portal
router.get('/portal', global.ensureAuthenticated, userController.portal_get);

// Seller - View Clients
router.get('/view', global.ensureAuthenticated, userController.client_view_get);
router.get('/view/:id', global.ensureAuthenticated, userController.client_read_get);

// Seller - Edit Clients
router.get('/edit/:id', global.ensureAuthenticated, userController.client_edit_get);
router.post('/edit/', global.ensureAuthenticated, userController.client_edit_post);

//Seller - Create Clients
router.get('/create/', global.ensureAuthenticated, userController.client_create_get);
router.post('/create/', global.ensureAuthenticated, userController.validate('clientCreateUser'), userController.client_new_post);

//Seller - Delete Client
router.post('/delete/:id', global.ensureAuthenticated, userController.client_delete_post);

// Client - Edit Profile
router.get('/edit_account', global.ensureAuthenticated, userController.edit_account_get);
router.post('/edit_account', global.ensureAuthenticated, userController.edit_account_post);
router.post('/edit_account_password', global.ensureClient, userController.validate('changePassword'), userController.edit_account_password);

router.get('/account', global.ensureAuthenticated, userController.account_get);

// Forgot form
router.get('/forgot', userController.forgot_get);

// Send to Email
router.post('/forgot', userController.validate('forgot'), userController.forgot_post);

// New password form
router.get('/reset/:token', userController.new_password);

// Confirm new password
router.post('/reset/:token', userController.validate('changePassword'), userController.reset_confirm);

// Contact
router.get('/contact', global.ensureAuthenticated, global.ensureClient, userController.contact_seller);

// Process contact
router.post('/send', userController.send_post);

module.exports = router;