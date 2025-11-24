import { Router } from 'express';
import { 
  createConsulta, 
  getHistorialByPaciente,
  deleteConsulta 
} from '../controllers/consultasController.js';

const router = Router();

// POST para registrar una nueva consulta (Diagnóstico, Prescripción, Tratamiento)
router.post('/', createConsulta);

// GET para obtener todo el historial de consultas de un paciente
router.get('/:pacienteId', getHistorialByPaciente);

// DELETE para eliminar un registro
router.delete('/:id', deleteConsulta);

export default router;