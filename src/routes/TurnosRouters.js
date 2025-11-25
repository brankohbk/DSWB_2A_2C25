import { Router } from 'express';
import express from 'express';
import TurnosController from '../controllers/TurnosController.js';


// const router = express.Router();
const router = Router();

// Middleware simple de validación para creación/actualización de turnos
function validarTurno(req, res, next) {
  const { pacienteId, empleadoId, fechaInicio, fechaFin, prioridad, estado } = req.body;

  if (!pacienteId || !empleadoId) {
    return res.status(400).json({ error: 'Paciente y empleado son obligatorios' });
  }

  if (!fechaInicio || !fechaFin || new Date(fechaInicio) > new Date(fechaFin)) {
    return res.status(400).json({ error: 'Fechas inválidas: fechaInicio debe ser anterior a fechaFin' });
  }

  const prioridadesValidas = ['alta', 'media', 'baja'];
  if (!prioridadesValidas.includes(prioridad)) {
    return res.status(400).json({ error: `Prioridad inválida. Valores permitidos: ${prioridadesValidas.join(', ')}` });
  }

  const estadosValidos = ['pendiente', 'en proceso', 'finalizado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
  }

  next(); // pasa al controlador si todo está bien
}

// Rutas para Turnos
router.get('/horarios/:medicoId', TurnosController.listarHorariosMedico);
router.post('/horarios', TurnosController.crearHorarioMedico);
router.get('/disponibles', TurnosController.horariosDisponibles);
router.post('/reservar', TurnosController.reservarTurnoAgenda);
router.get('/', TurnosController.listarTurnos);           
router.get('/:id', TurnosController.obtenerTurno);       
router.post('/', validarTurno, TurnosController.crearTurno); 
router.put('/:id', validarTurno, TurnosController.actualizarTurno);
router.delete('/:id', TurnosController.eliminarTurno);   

export default router;
