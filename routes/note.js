const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController.js');

router.post('/delete', global.ensureSeller, noteController.note_remove);
router.post('/create', global.ensureAuthenticated, noteController.note_create);

module.exports = router;