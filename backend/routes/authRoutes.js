const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Middleware para manejar errores de validación
const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rutas para autenticación
router.post(
    '/signup',
    [
        check('email').isEmail().withMessage('Debe ser un correo válido'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
        validateInputs,
    ],
    authController.signup
);

router.post(
    '/login',
    [
        check('email').isEmail().withMessage('Debe ser un correo válido'),
        check('password').notEmpty().withMessage('La contraseña es obligatoria'),
        validateInputs,
    ],
    authController.login
);

module.exports = router;
