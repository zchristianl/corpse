const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

// Register From
router.get('/', inventoryController.inventory_get);

module.exports = router;