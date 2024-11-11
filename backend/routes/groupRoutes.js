const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación

// Crear un grupo
router.post('/create', authMiddleware, groupController.createGroup);

// Obtener grupos del usuario
router.get('/mygroups', authMiddleware, groupController.getUserGroups);

// Añadir miembro a un grupo
router.post('/add-member', authMiddleware, groupController.addMemberToGroup);

module.exports = router;
