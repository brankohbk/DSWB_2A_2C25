import turnoModelo from '../models/Turno.js';

class TurnosController {

  // Listar todos los turnos
  static async listarTurnos(req, res) {
    try {
      const turnos = await turnoModelo.getAll();
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

  // Crear un nuevo turno
  static async crearTurno(req, res) {
    try {
      const { pacienteId, empleadoId, fechaInicio, fechaFin, prioridad, estado, observaciones } = req.body;
      if (!pacienteId || !empleadoId || !fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
      const nuevoTurno = { pacienteId, empleadoId, fechaInicio, fechaFin, prioridad, estado, observaciones };
      const turnoCreado = await turnoModelo.create(nuevoTurno);
      res.status(201).json(turnoCreado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un turno existente
  static async actualizarTurno(req, res) {
    try {
      const id = req.params.id;
      const datos = req.body;
      const turnoActualizado = await turnoModelo.update(id, datos);
      res.json(turnoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un turno por ID
  static async eliminarTurno(req, res) {
    try {
      const id = req.params.id;
      const eliminado = await turnoModelo.deleteById(id);
      res.json({ message: 'Turno eliminado', turno: eliminado });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default TurnosController;
