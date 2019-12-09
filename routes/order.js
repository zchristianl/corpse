const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.get('/', global.ensureAuthenticated, orderController.order_view_get);

router.get('/inquire', global.ensureAuthenticated, orderController.order_inquire_get);
router.post('/inquire', global.ensureAuthenticated, orderController.order_create_post);
router.get('/view/:id', global.ensureAuthenticated, orderController.order_get);
router.post('/modify', global.ensureAuthenticated, orderController.order_modify);
router.post('/delete/:id', global.ensureSeller, orderController.order_remove);

module.exports = router;