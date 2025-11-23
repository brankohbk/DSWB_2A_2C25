import { Router } from 'express';
import { serveProtectedFile } from '../controllers/fileAccessController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

router.get('/:fileName', isAuthenticated, serveProtectedFile);

export default router;