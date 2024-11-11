const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Rutas para gestión de grupos
router.post('/create', groupController.createGroup);

module.exports = router;
