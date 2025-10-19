import empleadoModelo  from '../models/Empleado.js';

export const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoModelo.getAll();
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
  const newEmpleado = {nombre, rol, area}
  try {
    await empleadoModelo.create(newEmpleado);
    res.status(201).json({ message: 'Empleado creado exitosamente', data: newEmpleado });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el empleado.', error: error.message });
  }
};

export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await empleadoModelo.findEmpleadoById(req.params.id);
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
    const updatedEmpleado = await empleadoModelo.update(req.params.id, req.body);
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
    const deleted = await empleadoModelo.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    res.status(200).json({ message: 'Empleado eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado.', error: error.message });
  }
};