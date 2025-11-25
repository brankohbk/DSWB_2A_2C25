import mongoose from "mongoose";

// Se define el esquema
const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  }
});

// Instanciar el modelo
const Empleado = mongoose.model('Empleado', empleadoSchema);

// Función: Obtener todos los Empleados
async function getAll() {
  return await Empleado.find();
}
async function findById(id) {
  return await Empleado.findById(id);
}
async function create(newEmpleado) {
  return await Empleado.create(newEmpleado)
}
async function update(id, doc) {
  return await Empleado.findByIdAndUpdate(id, doc, { new: true });
}
async function deleteById(id) {
  return await Empleado.findByIdAndDelete(id);
}

const empleadoModelo = {
  getAll,
  findById,
  create,
  update,
  deleteById
}

export default empleadoModelo;