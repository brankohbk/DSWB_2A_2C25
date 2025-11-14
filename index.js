import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import mongoose from 'mongoose';

import empleadosRoutes from './src/routes/empleadosRoutes.js';
import turnosRouter from './src/routes/TurnosRouters.js';
import areasRoutes from './src/routes/areasRoutes.js';
import viewRouters from './src/routes/viewRoutes.js';
import pacientesRoutes from './src/routes/pacientesRoutes.js';
import insumosRoutes from './src/routes/insumosRoutes.js';
import usuariosRoutes from './src/routes/usuariosRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 4501;
const app = express();
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
const db = process.env.MONGO_URI;


mongoose.connect(db)
  .then(() => console.log('Connection to Mongo DB established'))
  .catch(err => console.log(err));

app
// Middleware para procesar JSON y datos de formularios
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

// Middleware para permitir el uso de metodos PUT y DELETE
  .use(methodOverride('_method'))

// Configuración de Pug como motor de plantillas para front
  .set('view engine', 'pug')
  .set ('views', path.join(__dirname, 'src','views'))
  .use(express.static(path.join(__dirname, 'public')))

// Rutas de empleados
  .use('/api/empleados', empleadosRoutes)

 // Rutas de turnos
  .use('/api/turnos', turnosRouter)

  // Rutas de pacientes
  .use('/api/pacientes', pacientesRoutes)

  // Rutas de áreas
  .use('/api/areas', areasRoutes)

  // Rutas de insumos
  .use('/api/insumos', insumosRoutes)

  //Rutas de usuarios
  .use('/api/usuarios', usuariosRoutes)


// Rutas de vistas
  .use('/', viewRouters)
  //404/500:
  .use((req, res, next) => {
    res.status(404).render('404',{title:'No encontrado'});
  })
  .use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500',{title:'Error', err});
  })

// Inicia el servidor
  .listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
  