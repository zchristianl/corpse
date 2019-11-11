const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.get('/', global.ensureAuthenticated, orderController.order_get);

router.post('/create_invoice', orderController.create_invoice);

module.exports = router;