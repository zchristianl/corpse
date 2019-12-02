const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const paymentController = require('../controllers/paymentController');

// checkout 
router.get('/checkout/:id', global.ensureAuthenticated, paymentController.create_session);
router.post('/create', global.ensureAuthenticated, paymentController.payment_create);
router.post('/delete', global.ensureSeller, paymentController.payment_remove);

router.post('/payment_complete', bodyParser.raw({type: 'application/json'}), paymentController.stripe_webhook); 

module.exports = router;