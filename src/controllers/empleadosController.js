import { Empleado } from '../models/Empleado.js';

export const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.getAll();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados.' });
  }
};

export const createEmpleado = async (req, res) => {
  const { nombre, rol, area } = req.body;
  if (!nombre || !rol || !area) {
    return res.status(400).json({ message: 'Faltan datos para crear el empleado.' });
  }
  
  const nuevoEmpleado = new Empleado(nombre, rol, area);
  try {
    await Empleado.create(nuevoEmpleado);
    res.status(201).json({ message: 'Empleado creado exitosamente', data: nuevoEmpleado });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el empleado.', error: error.message });
  }
};

export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el empleado.', error: error.message });
  }
};

export const updateEmpleado = async (req, res) => {
  try {
    const updatedEmpleado = await Empleado.update(req.params.id, req.body);
    if (!updatedEmpleado) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.status(200).json({ message: 'Empleado actualizado exitosamente', data: updatedEmpleado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el empleado.', error: error.message });
  }
};

export const deleteEmpleado = async (req, res) => {
  try {
    const deleted = await Empleado.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.status(200).json({ message: 'Empleado eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado.', error: error.message });
  }
};