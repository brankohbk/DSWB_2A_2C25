import { Router } from 'express';
import { getAllEmpleados, createEmpleado, getEmpleadoById, updateEmpleado, deleteEmpleado } from '../controllers/empleadosController.js';

const router = Router();


router
// GET /api/empleados
  .get('/', getAllEmpleados)

// POST /api/empleados (nuevo empleado)
  .post('/', createEmpleado)

// GET empleado by ID
  .get('/:id', getEmpleadoById)

// PUT update empleado
  .put('/:id', updateEmpleado)

// DELETE empleado
  .delete('/:id', deleteEmpleado);

export default router;