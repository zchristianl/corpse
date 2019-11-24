const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// checkout 
router.get('/checkout', global.ensureAuthenticated, paymentController.checkout);

module.exports = router;