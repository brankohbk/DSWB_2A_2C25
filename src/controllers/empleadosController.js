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

  const nuevoEmpleado = { nombre, rol, area };
  try {
    await Empleado.save(nuevoEmpleado);
    res.status(201).json({ message: 'Empleado creado exitosamente', data: nuevoEmpleado });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el empleado.' });
  }
};