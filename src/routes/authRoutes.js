import { Router } from 'express';
import { showLogin, login, logout, registerInitialUser } from '../controllers/authController.js';

const router = Router();

router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', logout);

// Ruta secreta para crear el primer admin (luego bórrala o coméntala)
router.post('/register-admin', registerInitialUser);


export default router;