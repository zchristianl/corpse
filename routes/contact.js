const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController.js');

// Contact
router.get('/contact_seller', global.ensureAuthenticated, contactController.contact_seller);

// Process contact
router.post('/send', contactController.send_post);

module.exports = router;