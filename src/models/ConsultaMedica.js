import mongoose from "mongoose";

const consultaMedicaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: [true, 'El paciente es obligatorio para el registro de la consulta.']
  },
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: [true, 'El médico que atendió es obligatorio.']
  },

  fechaConsulta: {
    type: Date,
    required: true,
    default: Date.now
  },

  motivoConsulta: {
    type: String,
    required: [true, 'El motivo de la consulta es obligatorio.'],
    trim: true
  },

  diagnostico: {
    type: String,
    trim: true,
    required: [true, 'El diagnóstico es obligatorio.']
  },

  prescripcion: {
    type: String,
    trim: true
  },
  
  tratamiento: {
    type: String,
    trim: true
  }
  
}, {
  timestamps: true
});

const ConsultaMedica = mongoose.model('ConsultaMedica', consultaMedicaSchema);

async function create(newConsulta) {
  return await ConsultaMedica.create(newConsulta);
}

async function getByPacienteId(pacienteId) {
  return await ConsultaMedica
    .find({ paciente: pacienteId })
    .populate('medico', 'nombre rol')
    .sort({ fechaConsulta: -1 });
}

async function deleteById(id) {
  return await ConsultaMedica.findByIdAndDelete(id);
}

const consultaMedicaModelo = {
  create,
  getByPacienteId,
  deleteById,
  ConsultaMedica 
}

export default consultaMedicaModelo;