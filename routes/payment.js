const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// checkout 
router.get('/checkout', global.ensureAuthenticated, paymentController.checkout);
router.post('/create', global.ensureAuthenticated, paymentController.payment_create);

module.exports = router;