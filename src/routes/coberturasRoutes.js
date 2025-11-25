import { Router } from 'express';
import { getAllCoberturas, createCobertura, getCoberturaById, updateCobertura, deleteCobertura } from '../controllers/coberturasController.js';

const router = Router();


router
// GET /api/coberturas
  .get('/', getAllCoberturas)

// POST /api/coberturas (nuevo cobertura)
  .post('/', createCobertura)

// GET cobertura by ID
  .get('/:id', getCoberturaById)

// PUT update cobertura
  .put('/:id', updateCobertura)

// DELETE cobertura
  .delete('/:id', deleteCobertura);

export default router;