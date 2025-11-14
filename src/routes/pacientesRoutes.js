import { Router } from 'express';
import { getAllPacientes, createPacienteConUsuario, getAllPacientesParciales, getPacienteById, updatePaciente, deletePaciente} from '../controllers/pacientesController.js';


const router = Router();

router
  .get('/', getAllPacientes)
  .post('/', createPacienteConUsuario)
  .get("/incompletos", getAllPacientesParciales)
  .get('/:id', getPacienteById)
  .get('/parciales', getAllPacientesParciales)
  .put('/:id', updatePaciente)
  .delete('/:id', deletePaciente);
  

export default router;