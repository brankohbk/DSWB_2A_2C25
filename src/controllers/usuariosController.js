import bycrpt from "bcrypt";
import usuarioModelo from "../models/Usuario.js";
import pacienteModelo from "../models/Paciente.js";
import User from "../models/User.js";

//Registro del paciente desde la web:
export const registerPaciente = async (req, res) => {
    const { nombre, apellido, email, dni, password } = req.body;

    if (!nombre || !apellido || !email || !dni || !password) {
        return res.status(400).json({ message: 'Faltan datos para crear el usuario.' });
    }

    try {

        const emailLowerCase = email.toLowerCase();
        const nombreFormateado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        const apellidoFormateado = apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase();

        // Paso 1: Verificar que NO exista ni un usuario con ese mail ni un paciente con ese DNI
        // Paso 1: Validar que NO exista otro usuario con el mismo email
        const usuarioExistente = await usuarioModelo.findOne({ email: emailLowerCase });

            if (usuarioExistente) {
            return res.status(409).json({ 
                message: 'Ya existe un usuario registrado con ese email.' 
            });
            }

        // Paso 1b: Validar que NO exista otro paciente con el mismo DNI
        const pacienteExistente = await pacienteModelo.findOne({ dni });

            if (pacienteExistente) {
            return res.status(409).json({ 
                message: 'Ya existe un paciente con ese DNI.' 
            });
            }


        //Paso 2 : Hashear la contraseña Y generar nombre de usuario
        const hashedPassword = await bycrpt.hash(password, 10);
        const nombreUsuario = `${nombreFormateado.toLowerCase()}.${apellidoFormateado.toLowerCase()}.${dni}`;

        //Paso 3: Crear un nuevo paciente parcial
        const newPaciente = await pacienteModelo.create({
            nombre: nombreFormateado,
            apellido: apellidoFormateado,
            dni,
            email: emailLowerCase,
            datosCompletos: false
        });

        //Paso 4: Crear un nuevo usuario vinculado al paciente
        const newUsuario = await usuarioModelo.create({
            nombreUsuario,
            email: emailLowerCase,
            password: hashedPassword,
            pacienteId: newPaciente._id,
            rol: "paciente",
            primerIngreso: false
        });

        //PASO 4 BIS: crear el usuario de LOGIN en la colección `users`
        await User.create({
            username: nombreUsuario,
            password  // sin hashear, el hook del modelo la encripta
        });

        //Paso 5: Enviar respuesta
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario: newUsuario });
}catch(error){
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: 'Error al registrar el usuario.', error: error.message });}
};

export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan datos para iniciar sesión.' });
    }

    try {
        const usuario = await usuarioModelo.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        const isPasswordValid = await bycrpt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso.', 
            usuario: {
            id: usuario._id,
            nombreUsuario: usuario.nombreUsuario,
            rol: usuario.rol,
            primerIngreso: usuario.primerIngreso}
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
};

// Buscar usuario por ID: Para control interno
export const getUsuarioById = async (req, res) => {
    try {
        const usuario = await usuarioModelo.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el usuario.', error: error.message });
    }
};

//Listar todos los usuarios creados : Para control interno
export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModelo.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
        message: "Error al listar los usuarios",
        error: error.message
        });
    }
};