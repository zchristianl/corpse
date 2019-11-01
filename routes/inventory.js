const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

router.post('/edit',inventoryController.inventory_modify);
router.post('/create', inventoryController.inventory_modify);
router.post('/delete', inventoryController.inventory_remove);
router.get('/view', inventoryController.inventory_select);
// Inventory home
router.get('/', inventoryController.inventory_get);

module.exports = router;