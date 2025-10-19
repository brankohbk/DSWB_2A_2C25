import Area from '../models/Area.js';

export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las áreas.' });
  }
};

export const createArea = async (req, res) => {
  try {
    const newArea = await Area.create(req.body);
    res.status(201).json({ message: 'Área creada exitosamente', data: newArea });
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(400).json({ message: 'Ya existe un área con ese nombre.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos.', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al crear el área.', error: error.message });
  }
};

export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada.' });
    }
    res.status(200).json(area);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el área.', error: error.message });
  }
};

export const updateArea = async (req, res) => {
  try {
    const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArea) {
      return res.status(404).json({ message: 'Área no encontrada.' });
    }
    res.status(200).json({ message: 'Área actualizada exitosamente', data: updatedArea });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el área.', error: error.message });
  }
};

export const deleteArea = async (req, res) => {
  try {
    const deletedArea = await Area.findByIdAndDelete(req.params.id);
    if (!deletedArea) {
      return res.status(404).json({ message: 'Área no encontrada.' });
    }
    res.status(200).json({ message: 'Área eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el área.', error: error.message });
  }
};