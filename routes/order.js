const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.get('/', global.ensureAuthenticated, orderController.order_view_get);
router.get('/inquire', global.ensureAuthenticated, orderController.order_inquire_get);

// FOR TESING INVOICE CREATION AND EMAIL
router.post('/create_invoice', global.ensureAuthenticated, orderController.create_invoice);

module.exports = router;