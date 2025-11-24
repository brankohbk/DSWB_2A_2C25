import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  dni: { type: String, required: true, unique: false, trim: true },
  fechaNacimiento: { type: Date},
  obraSocial: { type: String },
  telefono: { type: String},
  email: { type: String, required: true, unique: false, sparse: true },
  registroParcial: { type: Boolean, default: true}
}, {
  timestamps: true
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

async function getAll() {
  return await Paciente.find();
}
async function findById(id) {
  return await Paciente.findById(id);
}
async function create(newPaciente) {
  return await Paciente.create(newPaciente);
}
async function update(id, doc) {
  return await Paciente.findByIdAndUpdate(id, doc, { new: true, runValidators: true });
}
async function deleteById(id) {
  return await Paciente.findByIdAndDelete(id);
}

// Busqueda de paciente por DNI para evitar repetidos:
async function findOne(filter) { return await Paciente.findOne(filter); }

//Busqueda de todos los pacientes con registro incompleto:
async function find(filter) { 
  return await Paciente.find(filter)
    .sort({ createdAt: -1 })
    .select({_id: 1, nombre: 1, apellido: 1, dni: 1, email: 1, telefono: 1, createdAt: 1 });
}

async function getAllPacientesParciales() {
  return await Paciente.find({ registroParcial: true });
}

const pacienteModelo = {
  getAll,
  findById,
  create,
  update,
  deleteById,
  findOne,
  getAllPacientesParciales,
  find
};

export default pacienteModelo;