import mongoose from "mongoose";

const insumoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del insumo es obligatorio.'],
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio.'],
    min: [0, 'El stock no puede ser negativo.'],
    default: 0
  },
  fechaVencimiento: {
    type: Date,
  },
  proveedor: {
    type: String,
    trim: true
  }
}, {
  timestamps: true 
});

const Insumo = mongoose.model('Insumo', insumoSchema);
export default Insumo;