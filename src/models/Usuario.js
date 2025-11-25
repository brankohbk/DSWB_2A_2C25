import mongoose from "mongoose";
const {Schema, model } = mongoose;

const usuariosSchema = new Schema({
    nombreUsuario: { 
        type: String, 
        required: [true,"El nombre es obligatorio."], 
        trim: true },
    email: { 
        type: String, 
        required: [true,"El mail es obligatorio."], 
        trim: true, 
        unique: true },
    password: { 
        type: String, 
        required: [true,"La contraseña es obligatoria."],
        trim: true },
    rol: { type: String, 
        enum: [ 'paciente','administrativo','jefe_administrativo', 'medico', 'jefe_medico','rrhh','gerente'],
        required: true, 
        trim: true },
    empleadoId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        default: null},
    pacienteId: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        default: null},
    primerIngreso: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Usuario = model('Usuario', usuariosSchema);

async function getAll() {
    return await Usuario.find();
}

async function findById(id) {
    return await Usuario.findById(id);
}

async function create(newUsuario) {
    return await Usuario.create(newUsuario);
}

async function update(id, doc) {
    return await Usuario.findByIdAndUpdate(id, doc, { new: true, runValidators: true });
}

async function deleteById(id) {
    return await Usuario.findByIdAndDelete(id);
}

async function findOne(filter) {
    ;
}

const usuarioModelo = {
    getAll,
    findById,
    create,
    update,
    deleteById,
    findOne
};

export default Usuario;