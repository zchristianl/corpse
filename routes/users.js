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

// Seller - View All Clients
router.get('/view', global.ensureAuthenticated, userController.client_view_get);

// Seller - Edit Clients
router.get('/edit/:id', global.ensureAuthenticated, userController.client_edit_get);
router.post('/edit/', global.ensureAuthenticated, userController.client_edit_post);

//Seller - Create Clients
router.get('/create/', global.ensureAuthenticated, userController.client_create_get);
router.post('/create/', global.ensureAuthenticated, userController.validate('createUser'), userController.register_post);

// Forgot form
router.get('/forgot', userController.forgot_get);

// Send to Email
router.post('/forgot', userController.validate('forgot'), userController.forgot_post);

// New password form
router.get('/reset/:token', userController.new_password);

// Confirm new password
router.post('/reset/:token', userController.validate('reset'), userController.reset_confirm);

module.exports = router;