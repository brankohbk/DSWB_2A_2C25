import pacienteModelo from '../models/Paciente.js';
import usuarioModelo from '../models/Usuario.js';
import bcrypt from 'bcrypt';


export const getAllPacientes = async (req, res) => {
  try {
    const pacientes = await pacienteModelo.getAll();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pacientes.', error: error.message });
  }
};

export const getPacienteById = async (req, res) => {
  try {
    const paciente = await pacienteModelo.findById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }
    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el paciente.', error: error.message });
  }
};

//Registro administrativo: 
//Nueva función para crear un paciente y un usuario vinculado.
// Permite registros parciales por casos de urgencias. 
export const createPacienteConUsuario = async (req, res) => {
  const { nombre, apellido, dni, fechaNacimiento, obraSocial, telefono, email, registroParcial} = req.body;

  if (!nombre || !apellido || !dni || !email) {
    return res.status(400).json({ message: 'Faltan datos para crear el paciente.' });
  }
  try{

    //Paso 1: Veririficar que el paciente no exista
    const pacienteExistente = await pacienteModelo.findOne({ dni });
    if (pacienteExistente) {
      return res.status(409).json({ message: 'Ya existe un paciente con ese DNI.' });
    }

    //Paso 2: Crear un nuevo paciente
    const formatearTexto = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    
    const emailLowerCase = email.toLowerCase();
    const nombreFormateado = formatearTexto(nombre);
    const apellidoFormateado = formatearTexto(apellido);
    const esParcial = !fechaNacimiento || !obraSocial || !telefono;

    const newPaciente = await pacienteModelo.create({ 
      nombre: nombreFormateado, 
      apellido: apellidoFormateado, 
      dni, 
      fechaNacimiento, 
      obraSocial, 
      telefono, 
      email: emailLowerCase,
      registroParcial: esParcial});
    
    //Paso 3:
    // Crear el nombre de usuario
    const nombreUsuario = `${nombreFormateado.toLowerCase()}.${apellidoFormateado}.${dni}`
    .toLowerCase()
    .replace(/\/+/g, '');

    // Crear contraseña por defecto:
    const passPorDefecto = "1234_Default!pass";
    const hashedPassword = await bcrypt.hash(passPorDefecto, 10);
    
    //Paso 4: Crear un nuevo usuario vinculado al paciente
    const newUsuario = await usuarioModelo.create({ 
      nombreUsuario: nombreUsuario,
      email: emailLowerCase,
      password: hashedPassword, 
      pacienteId: newPaciente._id,
      rol: "paciente",
      primerIngreso: true,}); //-->Luego del primer ingreso cambia de estado para obligar al paciente a cambiar la pass
    
    //Paso 5: Enviar respuesta
    res.status(201).json({ message: esParcial
      ?'Paciente y usuarios creados parcialmente (falta completar datos)'
      :'Paciente y usuario creados exitosamente',
      paciente: newPaciente,
      usuario: newUsuario });

  }catch (error) {
    res.status(500).json({ message: 'Error al crear paciente y usuario.', error: error.message });
  }
};

//Busqueda de pacientes con registro incompleto: registroParcial: true
export const getAllPacientesParciales = async (req, res) => {
  try{
    //Filtro opcional: por fecha
    const {desde} = req.query;
    let filtro = { registroParcial: true };
    
    if (desde) {
      filtro = { ...filtro, createdAt: { $gte: new Date(desde) } };
    }

    const pacientesIncompletos = await pacienteModelo.find(filtro);
    
    if(pacientesIncompletos.length === 0){
      return res.status(404).json({ message: 'No se encontraron pacientes con registro incompleto.' });
    }

    //Calcula los días desde el registro y establece un estado de urgencia:
    const data = pacientesIncompletos.map((p) => {
      const dias = Math.floor((Date.now() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24));
      return {
        _id: p._id,
        nombre : p.nombre,
        apellido: p.apellido,
        dni: p.dni,
        createdAt: p.createdAt,
        dias: dias,
        estado: 
        dias > 30
        ? 'Crítico'
        : dias > 7
        ? 'Pendiente'
        : 'Reciente'
      }
    });

    res.status(200).json({
      message: `Se encontraron ${pacientesIncompletos.length} pacientes con registros incompletos.`,
      pacientes: data,
    });
  }
  catch (error) {
    res.status(500).json({ 
      message: 'Error al buscar pacientes con registros incompletos.', 
      error: error.message,
    });
  }
};


export const updatePaciente = async (req, res) => {
  try {
    const updatedPaciente = await pacienteModelo.update(req.params.id, req.body);
    
    if (!updatedPaciente) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }

    //Si se actualizan correctamente los campos opcionales, se actualiza el registroParcial
    if(
      updatedPaciente.fechaNacimiento &&
      updatedPaciente.obraSocial &&
      updatedPaciente.telefono
    ){
      updatedPaciente.registroParcial = false;
      await updatedPaciente.save();
    }

    res.status(200).json({ message: 'Datos del paciente actualizados exitosamente', data: updatedPaciente });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Ya existe un paciente con ese DNI o email.', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el paciente.', error: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const deleted = await pacienteModelo.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }
    res.status(200).json({ message: 'Paciente eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el paciente.', error: error.message });
  }
};


/*export const createPaciente = async (req, res) => {
  const { nombre, apellido, dni, fechaNacimiento, obraSocial, telefono, email } = req.body;
  if (!nombre || !apellido || !dni || !fechaNacimiento) {
    return res.status(400).json({ message: 'Faltan datos requeridos: nombre, apellido, DNI y fecha de nacimiento son obligatorios.' });
  }
  
  const newPacienteData = { nombre, apellido, dni, fechaNacimiento, obraSocial, telefono, email };
  
  try {
    const pacienteCreado = await pacienteModelo.create(newPacienteData);
    res.status(201).json({ message: 'Paciente registrado exitosamente', data: pacienteCreado });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Ya existe un paciente con ese DNI o email.', error: error.message });
    }
    res.status(500).json({ message: 'Error al guardar el paciente.', error: error.message });
  }
};*/

/*
export const updatePaciente = async (req, res) => {
  try {
    const updatedPaciente = await pacienteModelo.update(req.params.id, req.body);
    if (!updatedPaciente) {
      return res.status(404).json({ message: 'Paciente no encontrado.' });
    }
    res.status(200).json({ message: 'Datos del paciente actualizados exitosamente', data: updatedPaciente });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Ya existe un paciente con ese DNI o email.', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el paciente.', error: error.message });
  }
};*/