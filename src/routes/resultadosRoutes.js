// src/routes/resultadosRoutes.js
import { Router } from 'express';
import { 
  uploadResultado, 
  getHistorialByPaciente,
  deleteResultado 
} from '../controllers/resultadosController.js';

const router = Router();

// POST para subir el archivo y registrar en DB
router.post('/upload', uploadResultado);

// GET para obtener todo el historial de estudios de un paciente
router.get('/:pacienteId', getHistorialByPaciente);

// DELETE para eliminar un registro
router.delete('/:id', deleteResultado);

export default router;