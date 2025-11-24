import Area from "../models/Area.js";

// Obtener todas las áreas
export const getAllAreas = async (req, res) => {
    try {
        const areas = await Area.find();
        res.status(200).json(areas);
    } catch (error) {
        console.error("Error al obtener áreas:", error);
        res.status(500).json({
        message: "Error al obtener las áreas.",
        error: error.message
        });
    }
};

// Crear un área
export const createArea = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    try {
        const areaExistente = await Area.findOne({ nombre });

        if (areaExistente) {
        return res.status(409).json({
            message: "Ya existe un área con ese nombre."
        });
        }

        const nuevaArea = await Area.create({ nombre });
        res.status(201).json({
        message: "Área creada exitosamente.",
        area: nuevaArea
    });

    } catch (error) {
        console.error("Error al crear área:", error);
        res.status(500).json({
        message: "Error al crear el área.",
        error: error.message
        });
    }
};

// Obtener un área por ID
export const getAreaById = async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);

        if (!area) {
        return res.status(404).json({
            message: "Área no encontrada."
        });
        }

        res.status(200).json(area);
    } catch (error) {
        console.error("Error al buscar área:", error);
        res.status(500).json({
        message: "Error al buscar el área.",
        error: error.message
        });
    }
};

// Actualizar área
export const updateArea = async (req, res) => {
    try {
        const updated = await Area.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );

        if (!updated) {
        return res.status(404).json({
            message: "Área no encontrada para actualizar."
        });
        }

        res.status(200).json({
        message: "Área actualizada exitosamente.",
        area: updated
        });

    } catch (error) {
        console.error("Error al actualizar área:", error);
        res.status(500).json({
        message: "Error al actualizar el área.",
        error: error.message
        });
    }
};

// Eliminar área
export const deleteArea = async (req, res) => {
    try {
        const deleted = await Area.findByIdAndDelete(req.params.id);

        if (!deleted) {
        return res.status(404).json({
            message: "Área no encontrada para eliminar."
        });
        }

        res.status(200).json({
        message: "Área eliminada exitosamente.",
        area: deleted
        });

    } catch (error) {
        console.error("Error al eliminar área:", error);
        res.status(500).json({
        message: "Error al eliminar el área.",
        error: error.message
        });
    }
};
