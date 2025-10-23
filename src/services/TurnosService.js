import turnoModelo from '../models/Turno.js';
import empleadoModelo from '../models/Empleado.js';
import pacienteModelo from '../models/Paciente.js';

class TurnosService {
  static async crearTurno(data) {
    const { pacienteId, empleadoId } = data;
    
    // Validar existencia de Empleado y paciente
    const empleado = await empleadoModelo.findById(empleadoId);
    if (!empleado) {
      throw new Error(`Error de validación: Empleado con ID ${empleadoId} no existe.`);
    }

    const paciente = await pacienteModelo.findById(pacienteId);
    if (!paciente) {
      throw new Error(`Error de validación: Paciente con ID ${pacienteId} no existe.`);
    }

        
    // Crear el turno usando el Modelo
    try {
      const nuevoTurno = await turnoModelo.create(data);
      return nuevoTurno;
    } catch (error) {
        throw new Error(`Error al crear el turno en la base de datos: ${error.message}`);
    }
  }
  
  static async listarTurnosConDetalle() {
    const turnos = await turnoModelo.getAll();
    const empleados = await empleadoModelo.getAll();
    const pacientes = await pacienteModelo.getAll();

    // Mapas para búsqueda rápida (ID (string) -> OBJETO)
    const empleadosMap = new Map(empleados.map(e => [e._id.toString(), e]));
    const pacientesMap = new Map(pacientes.map(p => [p._id.toString(), p]));

    return turnos.map(turno => {
      const turnoObj = turno.toObject ? turno.toObject() : turno;  
      const pacienteData = pacientesMap.get(turnoObj.pacienteId.toString());
      const empleadoData = empleadosMap.get(turnoObj.empleadoId.toString());
      
      return {
          ...turnoObj,
          pacienteData: pacienteData || { nombre: 'Paciente', apellido: 'No encontrado', dni: 'N/A' },
          empleadoData: empleadoData || { nombre: 'Médico No encontrado' } 
      };
    });
    }

    static async actualizarTurno(id, datos) {
        return await turnoModelo.update(id, datos);
    }
    
    static async eliminarTurno(id) {
        return await turnoModelo.deleteById(id);
    }
}

export default TurnosService;