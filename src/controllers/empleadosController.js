import empleadoModelo  from '../models/Empleado.js';
import usuarioModelo from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import User from "../models/User.js";

export const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoModelo.getAll();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados.' });
  }
};

/*export const createEmpleado = async (req, res) => {
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
};*/

//Nueva función para crear empleado y usuario en la base de datos
export const createEmpleadoConUsuario = async (req, res) => {
  const { nombre, rol, area,} = req.body;

  if (!nombre || !rol || !area) {
    return res.status(400).json({ message: 'Faltan datos para crear el empleado.' });
  }

  try {
    //Paso 1: Crear un nuevo empleado
    const newEmpleado = await empleadoModelo.create({ nombre, rol, area });
    
    //Paso 2: Generar y hashear contraseña para el usuario
    const passPorDefecto = "1234_Default!pass";
    const hashedPassword = await bcrypt.hash(passPorDefecto, 10);
    
    //Paso 3: Crear un nuevo usuario vinculado al empleado
    let nombreUsuario = nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")

    const email = `${nombreUsuario.toLowerCase()}@sanFulgencio.com`;
    const newUsuario = await usuarioModelo.create({ 
      nombreUsuario: nombreUsuario, 
      email,
      password: hashedPassword, 
      empleadoId: newEmpleado._id,
      rol: rol.toLowerCase(),
      primerIngreso: true,}); //-->Luego del primer ingreso cambia de estado para obligar al empleado a cambiar la pass
    
      //Paso 3BIS: 
      await User.create({
          username: nombreUsuario,
          password: passPorDefecto  // sin hashear, el hook del modelo la encripta
      });

    //Paso 4: Enviar respuesta
    res.status(201).json({ message: 'Empleado y usuario creados exitosamente', empleado: newEmpleado, usuario: newUsuario });
  } catch (error) {
    console.error("Error al crear empleado y usuario:", error);
    res.status(500).json({ message: 'Error al guardar el empleado y el usuario.', error: error.message });
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

//Crear un usuario para el empleado

export const createUsuario = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan datos para crear el usuario.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUsuario = { username, password: hashedPassword };
  try {
    await usuarioModelo.create(newUsuario);
    res.status(201).json({ message: 'Usuario creado exitosamente', data: newUsuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el usuario.', error: error.message });
  }
};