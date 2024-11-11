const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
    const roomId = generateRoomId(); // Implementa una función para generar un ID único de sala
    res.status(201).json({ roomId });
});

router.post('/join', (req, res) => {
    const { roomId } = req.body;
    if (roomExists(roomId)) { // Implementa una función para verificar si la sala existe
        res.status(200).json({ message: 'Unido a la sala', roomId });
    } else {
        res.status(404).json({ error: 'Sala no encontrada' });
    }
});

module.exports = router;
