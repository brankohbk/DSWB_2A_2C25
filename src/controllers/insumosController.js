import Insumo from '../models/Insumo.js';

// --- Obtener todos los insumos ---
export const getAllInsumos = async (req, res) => {
  try {
    const insumos = await Insumo.find();
    res.status(200).json(insumos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los insumos.' });
  }
};

// --- Crear un nuevo insumo ---
export const createInsumo = async (req, res) => {
  try {
    const newInsumo = await Insumo.create(req.body);
    res.status(201).json({ message: 'Insumo creado exitosamente', data: newInsumo });
  } catch (error) {
    if (error.code === 11000) { // Error de duplicado (nombre único)
      return res.status(400).json({ message: 'Ya existe un insumo con ese nombre.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos.', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al crear el insumo.', error: error.message });
  }
};

// --- Obtener un insumo por su ID ---
export const getInsumoById = async (req, res) => {
  try {
    const insumo = await Insumo.findById(req.params.id);
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado.' });
    }
    res.status(200).json(insumo);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el insumo.', error: error.message });
  }
};

// --- Actualizar un insumo (para reponer stock, etc.) ---
export const updateInsumo = async (req, res) => {
  try {
    // Usamos findByIdAndUpdate para manejar el stock
    // { new: true } devuelve el documento actualizado
    const updatedInsumo = await Insumo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!updatedInsumo) {
      return res.status(404).json({ message: 'Insumo no encontrado.' });
    }
    res.status(200).json({ message: 'Insumo actualizado exitosamente', data: updatedInsumo });
  } catch (error) {
     if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos.', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al actualizar el insumo.', error: error.message });
  }
};

// --- Eliminar un insumo ---
export const deleteInsumo = async (req, res) => {
  try {
    const deletedInsumo = await Insumo.findByIdAndDelete(req.params.id);
    if (!deletedInsumo) {
      return res.status(4404).json({ message: 'Insumo no encontrado.' });
    }
    res.status(200).json({ message: 'Insumo eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el insumo.', error: error.message });
  }
};

// --- Alertas de Stock Mínimo  ---
export const getAlertasStockMinimo = async (req, res) => {
  try {
    // Define el umbral de stock mínimo (ej. 50).
    // Podríamos pasarlo por req.query para hacerlo dinámico: /alertas?min=50
    const umbralMinimo = req.query.min || 50; 
    
    const insumosBajos = await Insumo.find({ 
      stock: { $lt: umbralMinimo } 
    }).sort({ stock: 1 }); // Ordena de menor a mayor stock

    if (insumosBajos.length === 0) {
      return res.status(200).json({ message: 'No hay alertas de stock.', data: [] });
    }
    
    res.status(200).json({ message: `Insumos con stock menor a ${umbralMinimo}`, data: insumosBajos });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las alertas de stock.', error: error.message });
  }
};