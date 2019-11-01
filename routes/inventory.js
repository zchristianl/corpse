const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

router.get('/edit',inventoryController.inventory_modify);
router.post('/edit/:id',inventoryController.inventory_modify);
router.get('/create', inventoryController.inventory_modify);
router.post('/create', inventoryController.inventory_create);
router.post('/delete/:id', inventoryController.inventory_remove);
router.get('/view', inventoryController.inventory_select);
// Inventory home
router.get('/', inventoryController.inventory_get);

module.exports = router;