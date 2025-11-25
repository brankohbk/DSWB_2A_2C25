import Insumo from "../models/Insumo.js";

// Obtener todos los insumos
export const getAllInsumos = async (req, res) => {
    try {
        const insumos = await Insumo.find().sort({ createdAt: -1 });
        res.status(200).json(insumos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los insumos", error: error.message });
    }
};

// Crear un insumo nuevo
export const createInsumo = async (req, res) => {
    try {
        const nuevoInsumo = await Insumo.create(req.body);
        res.status(201).json(nuevoInsumo);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el insumo", error: error.message });
    }
};

// Obtener insumo por ID
export const getInsumoById = async (req, res) => {
    try {
        const insumo = await Insumo.findById(req.params.id);
        if (!insumo) return res.status(404).json({ message: "Insumo no encontrado" });
        res.status(200).json(insumo);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el insumo", error: error.message });
    }
};

// Actualizar insumo
export const updateInsumo = async (req, res) => {
    try {
        const insumoActualizado = await Insumo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
        );

        if (!insumoActualizado)
        return res.status(404).json({ message: "Insumo no encontrado" });

        res.status(200).json(insumoActualizado);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar el insumo", error: error.message });
    }
};

// Eliminar insumo
export const deleteInsumo = async (req, res) => {
    try {
        const deleted = await Insumo.findByIdAndDelete(req.params.id);
        if (!deleted)
        return res.status(404).json({ message: "Insumo no encontrado" });

        res.status(200).json({ message: "Insumo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el insumo", error: error.message });
    }
};

// Obtener insumos con stock mínimo
export const getAlertasStockMinimo = async (req, res) => {
    try {
        const alertas = await Insumo.find({ stock: { $lte: 5 } }); // Ajustable

        res.status(200).json(alertas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener alertas", error: error.message });
    }
};
