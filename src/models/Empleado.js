import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const empleadosFilePath = path.join(__dirname, 'empleados.json');

export class Empleado {
  constructor(nombre, rol, area) {
    this.nombre = nombre;
    this.rol = rol;
    this.area = area;
    this.id = Date.now();
  }

  static async getAll() {
    try {
      const data = await fs.readFile(empleadosFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o está vacío, devuelve un array vacío.
      // TODO: Manejar mejor los errores.
      return [];
    }
  }

  /*
  static async save(empleado) {
    const empleados = await this.getAll();
    empleados.push(empleado);
    await fs.writeFile(empleadosFilePath, JSON.stringify(empleados, null, 2));
  }
  */

  static async saveAll(empleados) {
    await fs.writeFile(empleadosFilePath, JSON.stringify(empleados, null, 2));
  }

  static async create(empleado) {
    const empleados = await this.getAll();
    empleados.push(empleado);
    await this.saveAll(empleados);
  }

  static async findById(id) {
    const empleados = await this.getAll();
    return empleados.find(emp => emp.id == id);
  }

  static async update(id, newData) {
    const empleados = await this.getAll();
    const empleadoIndex = empleados.findIndex(emp => emp.id == id);
    if (empleadoIndex === -1) {
      return null; // Empleado no encontrado
    }
    const updatedEmpleado = { ...empleados[empleadoIndex], ...newData };
    empleados[empleadoIndex] = updatedEmpleado;
    await this.saveAll(empleados);
    return updatedEmpleado;
  }

  static async delete(id) {
    const empleados = await this.getAll();
    const empleadosRestantes = empleados.filter(emp => emp.id != id);
    if (empleados.length === empleadosRestantes.length) {
      return false; // No se encontró ningún empleado con ese ID
    }
    await this.saveAll(empleadosRestantes);
    return true; // Eliminación exitosa
  }
}
