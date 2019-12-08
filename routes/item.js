const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController.js');

router.post('/delete', global.ensureAuthenticated, itemController.item_remove);
router.post('/create', global.ensureSeller, itemController.item_create);

module.exports = router;