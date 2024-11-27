const express = require('express');
const { check, validationResult } = require('express-validator');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware para manejar errores de validación
const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Crear un grupo
router.post(
    '/create',
    [
        authMiddleware,
        check('name')
            .isLength({ min: 3 })
            .withMessage('El nombre del grupo debe tener al menos 3 caracteres')
            .trim(),
        validateInputs,
    ],
    groupController.createGroup
);

// Obtener los grupos del usuario
router.get('/mygroups', authMiddleware, groupController.getUserGroups);

// Añadir un miembro a un grupo
router.post(
    '/add-member',
    [
        authMiddleware,
        check('groupId')
            .notEmpty()
            .withMessage('El ID del grupo es obligatorio')
            .isMongoId()
            .withMessage('El ID del grupo debe ser un ID válido de MongoDB'),
        check('userId')
            .notEmpty()
            .withMessage('El ID del usuario es obligatorio')
            .isMongoId()
            .withMessage('El ID del usuario debe ser un ID válido de MongoDB'),
        validateInputs,
    ],
    groupController.addMember
);

module.exports = router;
