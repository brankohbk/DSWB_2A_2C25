import pacienteModelo from "../models/Paciente.js";
import usuarioModelo from "../models/Usuario.js";
import bcrypt from "bcrypt";

// ===============================
// 1. GET - Obtener todos los pacientes
// ===============================
export const getAllPacientes = async (req, res) => {
    try {
        const pacientes = await pacienteModelo.getAll();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los pacientes",
            error: error.message
        });
    }
};

// ===============================
// 2. GET - Obtener pacientes con registro incompleto
// ===============================
export const getAllPacientesParciales = async (req, res) => {
    try {
        const pacientes = await pacienteModelo.getAllPacientesParciales();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener pacientes parciales",
            error: error.message
        });
    }
};

// ===============================
// 3. GET - Obtener un paciente por ID
// ===============================
export const getPacienteById = async (req, res) => {
    try {
        const paciente = await pacienteModelo.findById(req.params.id);

        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el paciente",
            error: error.message
        });
    }
};

// ===============================================
// 4. POST - Crear paciente + usuario (registro interno)
// ===============================================
export const createPacienteConUsuario = async (req, res) => {
    const { nombre, apellido, dni, email, telefono, obraSocial, fechaNacimiento, password, rol } = req.body;

    if (!nombre || !apellido || !dni || !email) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    try {
        // Verificar que el paciente no exista
        const pacienteExistente = await pacienteModelo.findOne({ dni });

        if (pacienteExistente) {
            return res.status(409).json({ message: "Ya existe un paciente con ese DNI." });
        }

        // Crear paciente
        const newPaciente = await pacienteModelo.create({
            nombre,
            apellido,
            dni,
            email: email.toLowerCase(),
            telefono,
            obraSocial,
            fechaNacimiento,
            registroParcial: false
        });

        // Crear usuario asociado si viene contraseña
        let newUsuario = null;

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            const nombreUsuario = `${nombre.toLowerCase()}.${apellido.toLowerCase()}.${dni}`;

            newUsuario = await usuarioModelo.create({
                nombreUsuario,
                email: email.toLowerCase(),
                password: hashed,
                rol: rol || "paciente",
                pacienteId: newPaciente._id,
                primerIngreso: false
            });
        }

        res.status(201).json({
            message: "Paciente creado exitosamente",
            paciente: newPaciente,
            usuario: newUsuario
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear el paciente",
            error: error.message
        });
    }
};

// ===============================
// 5. PUT - Actualizar datos del paciente
// ===============================
export const updatePaciente = async (req, res) => {
    try {
        const pacienteActualizado = await pacienteModelo.update(req.params.id, req.body);

        if (!pacienteActualizado) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.status(200).json({
            message: "Paciente actualizado",
            paciente: pacienteActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el paciente",
            error: error.message
        });
    }
};

// ===============================
// 6. DELETE - Eliminar paciente
// ===============================
export const deletePaciente = async (req, res) => {
    try {
        const eliminado = await pacienteModelo.deleteById(req.params.id);

        if (!eliminado) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.status(200).json({ message: "Paciente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el paciente",
            error: error.message
        });
    }
};
