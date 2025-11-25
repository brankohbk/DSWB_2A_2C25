import User from '../models/User.js';
import usuarioModelo from '../models/Usuario.js';

// Renderizar vista de login
export const showLogin = (req, res) => {
    res.render('auth/login', { title: 'Iniciar Sesión' });
};

// Procesar login (POST)
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // 2. Usar el método del modelo para verificar pass
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // 3. Crear sesión (Guardamos lo esencial, no el pass)
        let rol = null;
        const usuarioApp = await usuarioModelo.findOne({ nombreUsuario: user.username });
        if (usuarioApp) {
            rol = usuarioApp.rol;
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            rol
        };

        res.status(200).json({ message: 'Bienvenido al sistema' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Cerrar sesión
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

// FUNCIÓN AUXILIAR: Crear un usuario inicial (Solo usar una vez o borrar después)
export const registerInitialUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.create({ username, password });
        res.json(newUser);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
