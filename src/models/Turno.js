import mongoose from "mongoose";

// Se define el esquema
const turnoSchema = new mongoose.Schema({
    pacienteId: {type: String, required: true},
    empleadoId: {type: String, required: true},
    fechaInicio: {type: Date, required: true},
    fechaFin: {type: Date, required: true},
    prioridad: {type: String, enum: ['alta', 'media', 'baja'], required: true},
    estado: {type: String, enum: ['pendiente', 'en proceso', 'finalizado'], required: true},
    observaciones: {type: String}
});

// Instanciar el modelo (crear Documento)
const Turno = mongoose.model('Turno', turnoSchema);

// Función: Obtener todos los Turnos
async function getAll() {
  return await Turno.find();
}
async function getById(id) {
  return await Turno.findById(id);
}
async function create(newTurno) {
  return await Turno.create(newTurno)
}
async function update(id, doc) {
  return await Turno.findByIdAndUpdate(id, doc, { new: true });
}
async function deleteById(id) {
  if (!id) throw new Error('ID is required');
  const deletedTurno = await Turno.findByIdAndDelete(id);
  if (!deletedTurno) throw new Error('Turno not found');
  return deletedTurno;
}

const turnoModelo = {
  getAll,
  getById,
  create,
  update,
  deleteById
}

export default turnoModelo;


/*
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
*/