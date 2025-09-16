import { Turno } from'../models/Turno.js';

class TurnosController {
  
  // Listar todos los turnos
  static async listarTurnos(req, res) {
    try {
      const turnos = await Turno.getAll();
      res.json(turnos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener un turno por ID
  static async obtenerTurno(req, res) {
    try {
      const id = req.params.id;
      const turno = await Turno.getById(id);
      if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
      res.json(turno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Crear un nuevo turno
  static async crearTurno(req, res) {
    try {
      const { pacienteId, empleadoId, fechaInicio, fechaFin, prioridad, estado, observaciones } = req.body;
      const nuevoTurno = new Turno(pacienteId, empleadoId, fechaInicio, fechaFin, prioridad, estado, observaciones);
      await Turno.save(nuevoTurno);
      res.status(201).json(nuevoTurno);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un turno existente
  static async actualizarTurno(req, res) {
    try {
      const id = req.params.id;
      const datos = req.body;
      const turnoActualizado = await Turno.update(id, datos);
      res.json(turnoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un turno por ID
  static async eliminarTurno(req, res) {
    try {
      const id = req.params.id;
      const eliminado = await Turno.delete(id);
      res.json({ message: 'Turno eliminado', turno: eliminado });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default TurnosController;
