import { Router } from 'express';
import { getAllEmpleados, createEmpleado } from '../controllers/empleadosController.js';

const router = Router();

// GET /api/empleados
router.get('/', getAllEmpleados);

// POST /api/empleados
router.post('/', createEmpleado);

export default router;