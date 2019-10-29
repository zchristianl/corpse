const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

// Inventory home
router.get('/', inventoryController.inventory_get);

module.exports = router;