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

module.exports = router;