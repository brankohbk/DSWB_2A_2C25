// src/models/ResultadoEstudio.js
import mongoose from "mongoose";

const resultadoEstudioSchema = new mongoose.Schema({
  // RF4: Asociar al paciente
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

  // Campo para almacenar el nombre del archivo subido (el PDF)
  nombreArchivo: {
    type: String,
    required: [true, 'El nombre del archivo subido es obligatorio.']
  },
  
  // Opcional: para fines de control de acceso y registro de la HCE
  observaciones: {
    type: String,
    trim: true
  }

}, {
  timestamps: true // Para rastrear la creación
});

// Crear el modelo con métodos CRUD básicos (manteniendo el patrón de tu proyecto)
const ResultadoEstudio = mongoose.model('ResultadoEstudio', resultadoEstudioSchema);

async function create(newResultado) {
  return await ResultadoEstudio.create(newResultado);
}

async function getByPacienteId(pacienteId) {
  // Usamos populate para traer los datos del médico asociado
  return await ResultadoEstudio.find({ paciente: pacienteId })
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
  ResultadoEstudio // Exportar el modelo directo para usos avanzados si se necesita
}

export default resultadoEstudioModelo;