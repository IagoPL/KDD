const Group = require("../models/Group");
const User = require("../models/User");

// Crear un grupo
const createGroup = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "El nombre del grupo es obligatorio" });
    }

    try {
        const group = new Group({
            name,
            members: [req.user.id],
            createdBy: req.user.id,
        });
        await group.save();
        return res.status(201).json({ group });
    } catch (error) {
        console.error("Error al crear el grupo:", error);
        return res.status(500).json({ error: "Error del servidor al crear el grupo" });
    }
};

// Obtener los grupos del usuario
const getUserGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id });
        return res.status(200).json(groups);
    } catch (error) {
        console.error("Error al obtener los grupos del usuario:", error);
        return res.status(500).json({ error: "Error del servidor al obtener los grupos" });
    }
};

// Añadir un miembro a un grupo
const addMember = async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        return res.status(400).json({ error: "Faltan parámetros requeridos: groupId o userId" });
    }

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Grupo no encontrado" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ error: "El usuario ya es miembro del grupo" });
        }

        group.members.push(userId);
        await group.save();

        return res.status(200).json({ message: "Miembro añadido con éxito" });
    } catch (error) {
        console.error("Error al añadir miembro:", error);
        return res.status(500).json({ error: "Error del servidor al añadir miembro" });
    }
};

module.exports = {
    createGroup,
    getUserGroups,
    addMember,
};
