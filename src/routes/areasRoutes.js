import { Router } from 'express';
import { getAllAreas, createArea, getAreaById, updateArea, deleteArea } from '../controllers/areasController.js';

const router = Router();

// --- Definición de las rutas para /api/areas ---
router
  // GET /api/areas (Obtiene todas las áreas)
  .get('/', getAllAreas)

  // POST /api/areas (Crea una nueva área)
  .post('/', createArea)

  // GET /api/areas/:id (Obtiene un área específica)
  .get('/:id', getAreaById)

  // PUT /api/areas/:id (Actualiza un área)
  .put('/:id', updateArea)

  // DELETE /api/areas/:id (Elimina un área)
  .delete('/:id', deleteArea);

export default router;