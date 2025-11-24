import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import session from 'express-session';
import fs from 'fs';


import { isAuthenticated, userToViews } from './src/middleware/auth.js';
import authRoutes from './src/routes/authRoutes.js';
import empleadosRoutes from './src/routes/empleadosRoutes.js';
import turnosRouter from './src/routes/TurnosRouters.js';
import areasRoutes from './src/routes/areasRoutes.js';
import viewRouters from './src/routes/viewRoutes.js';
import pacientesRoutes from './src/routes/pacientesRoutes.js';
import insumosRoutes from './src/routes/insumosRoutes.js';
import resultadosRoutes from './src/routes/resultadosRoutes.js';
import fileRoutes from './src/routes/fileRoutes.js';
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import registroRoutes from './src/routes/registroRoutes.js';
import { mostrarFormulario } from './src/controllers/registroViewsController.js';

// --- CONFIGURACIÓN INICIAL ---
dotenv.config();
const PORT = process.env.PORT || 4501;
const app = express();
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
const db = process.env.MONGO_URI;

// --- CONEXIÓN A BASE DE DATOS ---
mongoose.connect(db)
  .then(() => console.log('Conexión a Mongo DB establecida'))
  .catch(err => console.log(err));

app
// Middleware para procesar JSON y datos de formularios
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

// Middleware para permitir el uso de metodos PUT y DELETE
  .use(methodOverride('_method'))
  .use(express.static(path.join(__dirname, 'public')))

// Configuración de Pug como motor de plantillas para front
  .set('view engine', 'pug')
  .set ('views', path.join(__dirname, 'src','views'))

// --- CONFIGURACIÓN DE SESIÓN ---
// Esto crea la "caja fuerte" donde se guarda el usuario logueado
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_super_secreto_temporal', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true si usas https
}));

// Middleware para pasar el usuario logueado a las vistas (Pug)
app.use(userToViews);

// --- RUTAS ---
app.use('/auth', authRoutes);
app.use('/registro', mostrarFormulario);
app.use('/api/usuarios', usuariosRoutes);


// Aquí inyectamos 'isAuthenticated'. Si no hay sesión, los manda al login.

// API Endpoints (Protegidos)
// Si alguien intenta entrar aquí sin loguearse, el middleware lo rechaza
app.use('/api/empleados', isAuthenticated, empleadosRoutes);
app.use('/api/turnos', isAuthenticated, turnosRouter);
app.use('/api/pacientes', isAuthenticated, pacientesRoutes);
app.use('/api/areas', isAuthenticated, areasRoutes);
app.use('/api/insumos', isAuthenticated, insumosRoutes);
app.use('/api/resultados', isAuthenticated, resultadosRoutes);
app.use('/files', fileRoutes);

// 3. Rutas de Vistas (Frontend) - Llevan isAuthenticated
// Protegemos la vista principal para que nadie vea el panel sin loguearse
app.use('/', isAuthenticated, viewRouters);



// --- MANEJO DE ERRORES ---

// Error 404: No encontrado
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'No encontrado' });
});

// Error 500: Error del servidor
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500', { title: 'Error', err });
});

const uploadsDir = path.join(__dirname, 'files');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
