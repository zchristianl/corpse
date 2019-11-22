const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// checkout 
router.get('/checkout', global.ensureAuthenticated, paymentController.checkout_get);

// make payment
router.post('/checkout', global.ensureAuthenticated, paymentController.checkout_post);

//Add Payment
router.post('/create', global.ensureAuthenticated, paymentController.payment_create);

module.exports = router;