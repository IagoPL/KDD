const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registro de usuario
const signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El correo ya está en uso" });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generar un token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(201).json({
            message: "Usuario registrado con éxito",
            userId: newUser._id,
            token,
        });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({ error: "Error del servidor al registrar el usuario" });
    }
};

// Inicio de sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ error: "Error del servidor al iniciar sesión" });
    }
};

module.exports = { signup, login };
