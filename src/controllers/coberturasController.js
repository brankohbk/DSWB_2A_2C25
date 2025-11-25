import coberturaModelo from '../models/Cobertura.js';

export const getAllCoberturas = async (req, res) => {
  try {
    const coberturas = await coberturaModelo.getAll();
    res.status(200).json(coberturas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los coberturas.' });
  }
};

export const createCobertura = async (req, res) => {
  const { prestador, plan } = req.body;
  if (!prestador || !plan) {
    return res.status(400).json({ message: 'Faltan datos para crear el cobertura.' });
  }
  const newCobertura = { prestador, plan }
  try {
    await coberturaModelo.create(newCobertura);
    res.status(201).json({ message: 'Cobertura creado exitosamente', data: newCobertura });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el cobertura.', error: error.message });
  }
};

export const getCoberturaById = async (req, res) => {
  try {
    const cobertura = await coberturaModelo.findCoberturaById(req.params.id);
    if (!cobertura) {
      return res.status(404).json({ message: 'Cobertura no encontrado.' });
    }
    res.status(200).json(cobertura);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el cobertura.', error: error.message });
  }
};

export const updateCobertura = async (req, res) => {
  try {
    const updatedCobertura = await coberturaModelo.update(req.params.id, req.body);
    if (!updatedCobertura) {
      return res.status(404).json({ message: 'Cobertura no encontrado.' });
    }
    res.status(200).json({ message: 'Cobertura actualizado exitosamente', data: updatedCobertura });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cobertura.', error: error.message });
  }
};

export const deleteCobertura = async (req, res) => {
  try {
    const deleted = await coberturaModelo.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Cobertura no encontrado.' });
    }
    res.status(200).json({ message: 'Cobertura eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cobertura.', error: error.message });
  }
};