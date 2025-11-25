import { Router } from 'express';
import { mostrarFormulario} from '../controllers/registroViewsController.js';    
const router = Router();

router.get('/registro', mostrarFormulario);  // Muestra el formulario


export default router;
