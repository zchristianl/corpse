const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const paymentController = require('../controllers/paymentController');

// checkout 
router.get('/checkout', global.ensureAuthenticated, paymentController.checkout);

router.post('/payment_complete', bodyParser.raw({type: 'application/json'}), paymentController.stripe_webhook); 

module.exports = router;