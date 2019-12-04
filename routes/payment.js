const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// checkout 
router.get('/checkout/:id', global.ensureAuthenticated, paymentController.create_session);
router.post('/create', global.ensureAuthenticated, paymentController.payment_create);

router.get('/success', paymentController.success_get);
router.get('/cancel', paymentController.cancel_get);
router.post('/stripe_webhook', paymentController.stripe_webhook); 

module.exports = router;