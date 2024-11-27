const express = require('express');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const activeRooms = {};

// Middleware para manejar errores de validación
const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Crear una sala
router.post('/create', authMiddleware, (req, res) => {
    const roomId = Math.random().toString(36).substring(2, 10);
    activeRooms[roomId] = { createdBy: req.user.id };
    res.status(201).json({ success: true, roomId });
});

// Unirse a una sala
router.post('/join', [
    authMiddleware,
    check('roomId')
        .notEmpty()
        .withMessage('El ID de la sala es obligatorio')
        .isString()
        .withMessage('El ID de la sala debe ser un texto válido'),
    validateInputs
], (req, res) => {
    const { roomId } = req.body;
    if (activeRooms[roomId]) {
        res.status(200).json({ message: 'Unido a la sala', roomId });
    } else {
        res.status(404).json({ error: 'Sala no encontrada' });
    }
});

module.exports = router;
