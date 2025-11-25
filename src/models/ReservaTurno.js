import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: true
    },
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    // fecha y hora exactas del turno (inicio del turno)
    fecha: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['reservado', 'confirmado', 'cancelado'],
        default: 'reservado'
    },
    motivo: {
        type: String
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

// Un médico no puede tener dos turnos en el mismo horario
reservaSchema.index({ medico: 1, fecha: 1 }, { unique: true });

export default mongoose.model('ReservaTurno', reservaSchema);
