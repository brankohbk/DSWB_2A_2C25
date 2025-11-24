import consultaMedicaModelo from '../models/ConsultaMedica.js';

// POST /api/consultas
export const createConsulta = async (req, res) => {
  const { paciente, medico, motivoConsulta, diagnostico, prescripcion, tratamiento } = req.body;
  
  if (!paciente || !medico || !motivoConsulta || !diagnostico) {
    return res.status(400).json({ message: 'Faltan datos requeridos (Paciente, Médico, Motivo y Diagnóstico).' });
  }

  try {
    const nuevaConsulta = await consultaMedicaModelo.create(req.body);
    res.status(201).json({ message: 'Consulta médica registrada exitosamente', data: nuevaConsulta });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos.', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al registrar la consulta.', error: error.message });
  }
};

// GET /api/consultas/:pacienteId
export const getHistorialByPaciente = async (req, res) => {
  try {
    const historial = await consultaMedicaModelo.getByPacienteId(req.params.pacienteId);
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de consultas.', error: error.message });
  }
};

// DELETE /api/consultas/:id
export const deleteConsulta = async (req, res) => {
  try {
    const deleted = await consultaMedicaModelo.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Registro de consulta no encontrado.' });
    }
    res.status(200).json({ message: 'Consulta eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la consulta.', error: error.message });
  }
};