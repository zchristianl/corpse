const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.get('/', global.ensureAuthenticated, orderController.order_get);

module.exports = router;