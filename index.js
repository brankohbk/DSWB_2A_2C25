import express from 'express';
import dotenv from 'dotenv';
import empleadosRoutes from './src/routes/empleadosRoutes.js';
import turnosRouter from './src/routes/TurnosRouters.js';

dotenv.config();
const PORT = process.env.PORT || 4501;
const app = express();

app
// Middleware para procesar JSON y datos de formularios
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

// Configuración de Pug como motor de plantillas para front
  .set('view engine', 'pug')
  .set('views', './src/views')
  
// Middleware de prueba para verificar que el servidor funciona
  .get('/', (req, res) => {
    res.send('¡Servidor de la clínica funcionando!');
  })

// Rutas de empleados
  .use('/api/empleados', empleadosRoutes)

   // Rutas de turnos
  .use('/api/turnos', turnosRouter)  

// Inicia el servidor
  .listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });