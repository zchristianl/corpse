const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

router.get('/edit',inventoryController.inventory_modify);
router.get('/create', inventoryController.inventory_modify);
router.get('/delete', inventoryController.inventory_remove);
router.get('/view', inventoryController.inventory_select);
// Inventory home
router.get('/', inventoryController.inventory_get);

module.exports = router;