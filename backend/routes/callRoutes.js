const express = require('express');
const router = express.Router();

const activeRooms = {}; // Objeto en memoria para almacenar las salas activas

// Función para generar un ID de sala único
function generateRoomId() {
    return Math.random().toString(36).substring(2, 10); // Genera un ID aleatorio de 8 caracteres
}

// Función para verificar si una sala existe
function roomExists(roomId) {
    return activeRooms[roomId] !== undefined;
}

// Ruta para crear una nueva llamada
router.post('/create', (req, res) => {
    const roomId = generateRoomId();
    activeRooms[roomId] = true; // Guarda la sala como activa
    res.status(201).json({ success: true, roomId }); // Respuesta JSON con `Content-Type: application/json`
});

// Ruta para unirse a una sala existente
router.post('/join', (req, res) => {
    const { roomId } = req.body;
    if (roomExists(roomId)) {
        res.status(200).json({ message: 'Unido a la sala', roomId });
    } else {
        res.status(404).json({ error: 'Sala no encontrada' });
    }
});

module.exports = router;
