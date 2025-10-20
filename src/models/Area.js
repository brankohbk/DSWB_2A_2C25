import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del área es obligatorio.'],
    trim: true,
    unique: true // Evita que se creen áreas con el mismo nombre
  }
}, {
  timestamps: true 
});

const Area = mongoose.model('Area', areaSchema);
export default Area;