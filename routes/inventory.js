const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController.js');

//router.get('/edit',inventoryController.inventory_modify);
router.get('/edit', global.ensureAuthenticated, inventoryController.inventory_modify);
router.get('/edit/:id', global.ensureAuthenticated, inventoryController.inventory_modify);
router.post('/edit', global.ensureAuthenticated, inventoryController.inventory_modify);
router.get('/create', global.ensureAuthenticated, inventoryController.inventory_create);
router.post('/create', global.ensureAuthenticated, inventoryController.inventory_create);
router.post('/delete/:id', global.ensureAuthenticated, inventoryController.inventory_remove);
router.get('/view', global.ensureAuthenticated, inventoryController.inventory_select);
// Inventory home
router.get('/', global.ensureAuthenticated, inventoryController.inventory_get);

module.exports = router;