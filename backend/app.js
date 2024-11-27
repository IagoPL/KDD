require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require('cors');
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const callRoutes = require("./routes/callRoutes");

// Inicializar la aplicación
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
app.use("/api/calls", callRoutes);

// Exportar solo la aplicación
module.exports = app;
