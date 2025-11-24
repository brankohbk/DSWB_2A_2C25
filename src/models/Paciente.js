import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  dni: { type: String, required: true, unique: true, trim: true },
  fechaNacimiento: { type: Date, required: true },
  obraSocial: { type: mongoose.Schema.Types.ObjectId, ref:'Cobertura', required: true,},
  telefono: { type: String, trim: true },
  email: { type: String, trim: true, unique: true, sparse: true }
}, {
  timestamps: true
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

async function getAll() {
  return await Paciente.find().populate("obraSocial");
}
async function findById(id) {
  return await Paciente.findById(id).populate("obraSocial");
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

const pacienteModelo = {
  getAll,
  findById,
  create,
  update,
  deleteById
}

export default pacienteModelo;