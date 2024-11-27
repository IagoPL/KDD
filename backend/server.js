const http = require("http");
const mediasoup = require("mediasoup");
const app = require("./app");
const config = require("./config/mediasoupConfig");

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.io
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    // Eventos de señalización WebRTC
    socket.on("offer", (data) => {
        socket.to(data.room).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
        socket.to(data.room).emit("answer", data.answer);
    });

    socket.on("candidate", (data) => {
        socket.to(data.room).emit("candidate", data.candidate);
    });

    // Evento para unirse a una sala
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`Cliente ${socket.id} se unió a la sala ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

// Inicializar Workers de Mediasoup
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
