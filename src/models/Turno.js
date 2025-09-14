import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const turnosFilePath = path.join(__dirname, 'turnos.json');

class Turno {
  constructor(paciente, empleadoId, fechaInicio, fechaFin, prioridad, estado, observaciones) {
    this.paciente = paciente;
    this.empleadoId = empleadoId;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.prioridad = prioridad;
    this.estado = estado;
    this.observaciones = observaciones;
    this.id = Date.now();
  }

  static async getAll() {
    try {
      const data = await fs.readFile(turnosFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async save(turno) {
    const turnos = await this.getAll();
    turnos.push(turno);
    await fs.writeFile(turnosFilePath, JSON.stringify(turnos, null, 2));
  }
}

module.exports = Turno;