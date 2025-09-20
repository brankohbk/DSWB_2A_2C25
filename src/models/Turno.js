import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const turnosFilePath = path.join(__dirname, '../data/turnos.json');

const ESTADOS = ['pendiente', 'en proceso', 'finalizado'];
const PRIORIDADES = ['alta', 'media', 'baja'];

export class Turno {
  constructor(pacienteId, empleadoId, fechaInicio, fechaFin, prioridad, estado, observaciones) {
    // this.id = Date.now();
    this.id = uuidv4();
    this.pacienteId = pacienteId;
    this.empleadoId = empleadoId;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.prioridad = prioridad;
    this.estado = estado;
    this.observaciones = observaciones;
  }

   // Validación de datos del turno
  static validar(turno) {
    if (!turno.pacienteId || !turno.empleadoId) {
      throw new Error('Paciente y empleado son obligatorios');
    }
    if (!turno.fechaInicio || !turno.fechaFin || new Date(turno.fechaInicio) > new Date(turno.fechaFin)) {
      throw new Error('Fechas inválidas: fechaInicio debe ser anterior a fechaFin');
    }
    if (!PRIORIDADES.includes(turno.prioridad)) {
      throw new Error(`Prioridad inválida. Valores permitidos: ${PRIORIDADES.join(', ')}`);
    }
    if (!ESTADOS.includes(turno.estado)) {
      throw new Error(`Estado inválido. Valores permitidos: ${ESTADOS.join(', ')}`);
    }
  }

  static async getAll() {
    try {
      const data = await fs.readFile(turnosFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

    // Obtener turno por ID
  static async getById(id) {
    const turnos = await this.getAll();
    return turnos.find(t => t.id === id);
  }

 // Guardar un nuevo turno
  static async save(turno) {
    this.validar(turno);
    const turnos = await this.getAll();
    turnos.push(turno);
    await fs.writeFile(turnosFilePath, JSON.stringify(turnos, null, 2));
    return turno;
  }
  
  // Actualizar un turno existente
  static async update(id, datos) {
    const turnos = await this.getAll();
    const index = turnos.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Turno no encontrado');

    const turnoActualizado = { ...turnos[index], ...datos };
    this.validar(turnoActualizado);
    turnos[index] = turnoActualizado;

    await fs.writeFile(turnosFilePath, JSON.stringify(turnos, null, 2));
    return turnoActualizado;
  }

  // Eliminar un turno por ID
  static async delete(id) {
    const turnos = await this.getAll();
    const index = turnos.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Turno no encontrado');

    const eliminado = turnos.splice(index, 1)[0];
    await fs.writeFile(turnosFilePath, JSON.stringify(turnos, null, 2));
    return eliminado;
  }
}

// export default Turno;
