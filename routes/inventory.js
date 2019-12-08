const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

router.get('/edit', global.ensureSeller, inventoryController.inventory_modify);
router.get('/edit/:id', global.ensureSeller, inventoryController.inventory_modify);
router.post('/edit', global.ensureSeller, inventoryController.inventory_modify);
router.get('/create', global.ensureSeller, inventoryController.inventory_create);
router.post('/create', global.ensureSeller, inventoryController.inventory_create);
router.post('/delete/:id', global.ensureSeller, inventoryController.inventory_remove);
router.post('/getsell', global.ensureSeller, inventoryController.inventory_get_sellable_items);
//router.get('/view', global.ensureSeller, inventoryController.inventory_select);
// Inventory home
router.get('/', global.ensureSeller, inventoryController.inventory_get);

module.exports = router;