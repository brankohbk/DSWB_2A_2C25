import TurnosService from '../services/TurnosService.js'
import turnoModelo from '../models/Turno.js';

class TurnosController {

  // Listar todos los turnos con detalle (usando el servicio)
  static async listarTurnos(req, res) {
    try {
      const turnos = await TurnosService.listarTurnosConDetalle();
      res.json(turnos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener un turno por ID
  static async obtenerTurno(req, res) {
    try {
      const id = req.params.id;
      const turno = await turnoModelo.getById(id);
      if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json(turno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear un nuevo turno (usando el servicio para la lógica de validación)
  static async crearTurno(req, res) {
    try {
      const data = req.body;
      const turnoCreado = await TurnosService.crearTurno(data);
      res.status(201).json(turnoCreado);
    } catch (error) {
      if (error.message.startsWith('Error de validación')) {
          return res.status(400).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un turno existente (usando el servicio)
  static async actualizarTurno(req, res) {
    try {
      const id = req.params.id;
      const datos = req.body;
      const turnoActualizado = await TurnosService.actualizarTurno(id, datos);
      res.json(turnoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un turno por ID (usando el servicio)
  static async eliminarTurno(req, res) {
    try {
      const id = req.params.id;
      const eliminado = await TurnosService.eliminarTurno(id);
      res.json({ message: 'Turno eliminado', turno: eliminado });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default TurnosController;
