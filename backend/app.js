require("dotenv").config({ path: "../.env" });
const mediasoup = require("mediasoup");
const config = require("./config/mediasoupConfig");
const cors = require('cors');
const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const callRoutes = require("./routes/callRoutes");

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Conexión a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use("/api/users", authRoutes);
app.use("/api/groups", groupRoutes); 
app.use("/api/calls", callRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Inicialización del servidor HTTP y Socket.io
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// Inicialización de Socket.io para WebRTC
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Eventos de señalización WebRTC
    socket.on('offer', (data) => {
        socket.to(data.room).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
        socket.to(data.room).emit('answer', data.answer);
    });

    socket.on('candidate', (data) => {
        socket.to(data.room).emit('candidate', data.candidate);
    });

    // Evento para unirse a una sala
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Cliente ${socket.id} se unió a la sala ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Inicialización de Workers de Mediasoup
const workers = [];
(async () => {
    for (let i = 0; i < 2; i++) {
        const worker = await mediasoup.createWorker(config.mediasoup.worker);
        workers.push(worker);
        console.log(`Mediasoup worker ${i + 1} started`);
    }
})();

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
