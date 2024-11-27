const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.TEST_DB_URL || process.env.DB_URL;
    if (!uri) {
        throw new Error("La URL de la base de datos no está definida");
    }

    // Verifica si ya hay una conexión activa
    if (mongoose.connection.readyState === 1) {
        console.log("Ya existe una conexión activa con MongoDB");
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB", err.message);
        throw new Error("Database connection failed");
    }
};

module.exports = connectDB;
