import mongoose from "mongoose";

const AgendaMedicaSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    // 0 = domingo, 1 = lunes, ..., 6 = sábado
    diaSemana: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    },
    // formato "HH:MM", ej: "08:00"
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    },
    duracionTurnoMin: {
        type: Number,
        default: 30
    }
});

AgendaMedicaSchema.index({ medico: 1, diaSemana: 1 }, { unique: true });

export default mongoose.model('AgendasMedicos', AgendaMedicaSchema);

