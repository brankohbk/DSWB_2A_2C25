import mongoose from "mongoose";

// Se define el esquema
const coberturaSchema = new mongoose.Schema({
  prestador: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true
  }
});

// Instanciar el modelo
const Cobertura = mongoose.model('Cobertura', coberturaSchema);

// Función: Obtener todos los Coberturas
async function getAll() {
  return await Cobertura.find().sort({prestador:1,plan:1});
}
async function findById(id) {
  return await Cobertura.findById(id);
}
async function create(newCobertura) {
 return await Cobertura.create(newCobertura)
}
async function update(id, doc) {
  return await Cobertura.findByIdAndUpdate(id, doc, { new: true });
}
async function deleteById(id) {
  return await Cobertura.findByIdAndDelete(id);
}

const coberturaModelo = {
  getAll,
  findById,
  create,
  update,
  deleteById
}

export default coberturaModelo;