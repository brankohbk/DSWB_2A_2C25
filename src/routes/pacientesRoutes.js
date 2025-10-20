import { Router } from 'express';
import { getAllPacientes, createPaciente, getPacienteById, updatePaciente, deletePaciente } from '../controllers/pacientesController.js';

const router = Router();

router
  .get('/', getAllPacientes)
  .post('/', createPaciente)
  .get('/:id', getPacienteById)
  .put('/:id', updatePaciente)
  .delete('/:id', deletePaciente);

export default router;