import express from 'express';
import * as usuarioController from '../controllers/usuariosController.js'; 


const router = express.Router();

router
    .post('/login', usuarioController.loginUsuario)
    .post('/registerPaciente', usuarioController.registerPaciente)
    .get('/:id', usuarioController.getUsuarioById)
    .get("/", usuarioController.getAllUsuarios);

export default router;