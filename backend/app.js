require("dotenv").config({ path: "../.env" }); // Cargar el archivo .env desde la raíz del proyecto
const mediasoup = require("mediasoup");
const config = require("./config/mediasoupConfig");
const cors = require('cors');

const express = require("express");
const connectDB = require("./config/database"); // Importa la función de conexión a la base de datos
const authRoutes = require("./routes/authRoutes"); // Rutas para autenticación
const groupRoutes = require("./routes/groupRoutes"); // Rutas para grupos
const callRoutes = require("./routes/callRoutes");

const app = express();
const workers = [];

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
app.use("/api/calls", callRoutes); // Rutas para llamadas

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Inicialización de Workers de Mediasoup
(async () => {
  for (let i = 0; i < 2; i++) {
    const worker = await mediasoup.createWorker(config.mediasoup.worker);
    workers.push(worker);
    console.log(`Mediasoup worker ${i + 1} started`);
  }
})();
