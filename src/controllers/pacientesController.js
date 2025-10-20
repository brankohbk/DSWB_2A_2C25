import pacienteModelo from '../models/Paciente.js';

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

export const createPaciente = async (req, res) => {
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
};

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