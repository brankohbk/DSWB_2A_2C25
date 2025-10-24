import { Router } from 'express';
import { 
  getAllInsumos, 
  createInsumo, 
  getInsumoById, 
  updateInsumo, 
  deleteInsumo,
  getAlertasStockMinimo 
} from '../controllers/insumosController.js';

const router = Router();

// --- Definición de las rutas para /api/insumos ---

// Ruta especial para alertas (debe ir ANTES de /:id)
// GET /api/insumos/alertas
router.get('/alertas', getAlertasStockMinimo);

router
  // GET /api/insumos (Obtiene todos los insumos)
  .get('/', getAllInsumos)

  // POST /api/insumos (Crea un nuevo insumo)
  .post('/', createInsumo)

  // GET /api/insumos/:id (Obtiene un insumo específico)
  .get('/:id', getInsumoById)

  // PUT /api/insumos/:id (Actualiza un insumo)
  .put('/:id', updateInsumo)

  // DELETE /api/insumos/:id (Elimina un insumo)
  .delete('/:id', deleteInsumo);

export default router;