const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "No se proporcionó un token de autenticación" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "El formato del token es incorrecto" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "El token ha expirado" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token inválido" });
        }
        console.error("Error en el middleware de autenticación:", error);
        return res.status(500).json({ error: "Error interno en la autenticación" });
    }
};

module.exports = authMiddleware;
