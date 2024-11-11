const Group = require('../models/Group');
const User = require('../models/User');

// Crear un grupo
exports.createGroup = async (req, res) => {
    const { name } = req.body;
    try {
        const group = new Group({ name, members: [req.user.id] });
        await group.save();
        res.status(201).json({ message: 'Grupo creado con éxito', group });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el grupo' });
    }
};

// Obtener grupos del usuario
exports.getUserGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los grupos' });
    }
};

// Añadir un miembro a un grupo
exports.addMemberToGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Grupo no encontrado' });

        // Evitar duplicados
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }
        res.status(200).json({ message: 'Miembro añadido con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir miembro al grupo' });
    }
};
