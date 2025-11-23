import mongoose from "mongoose";

const resultadoEstudioSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: [true, 'El paciente es obligatorio.']
  },
  
  // Asociado al empleado que realiza o solicita el estudio (opcional)
  empleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    default: null
  },

  fechaCarga: {
    type: Date,
    required: true,
    default: Date.now
  },

  tipoEstudio: {
    type: String,
    required: [true, 'El tipo de estudio (ej: Hemograma, Placa, etc.) es obligatorio.'],
    trim: true
  },

  nombreArchivo: {
    type: String,
    required: [true, 'El nombre del archivo subido es obligatorio.']
  },
  
  observaciones: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

const ResultadoEstudio = mongoose.model('ResultadoEstudio', resultadoEstudioSchema);

async function create(newResultado) {
  return await ResultadoEstudio.create(newResultado);
}

async function getByPacienteId(pacienteId) {
  return await ResultadoEstudio
    .find({ paciente: pacienteId })
    .populate('empleado', 'nombre rol')
    .sort({ fechaCarga: -1 });
}

async function deleteById(id) {
  return await ResultadoEstudio.findByIdAndDelete(id);
}

const resultadoEstudioModelo = {
  create,
  getByPacienteId,
  deleteById,
  ResultadoEstudio
}

export default resultadoEstudioModelo;