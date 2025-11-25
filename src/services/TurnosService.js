import turnoModelo from '../models/Turno.js';
import empleadoModelo from '../models/Empleado.js';
import pacienteModelo from '../models/Paciente.js';
import AgendasMedicos from '../models/AgendasMedicos.js';
import ReservaTurno from '../models/ReservaTurno.js';

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

    static async obtenerHorariosDisponibles({ medicoId, fecha }) {
    if (!medicoId || !fecha) {
      throw new Error('medicoId y fecha son obligatorios');
    }

    const partes = fecha.split('-');
    if (partes.length !== 3) {
      throw new Error('Fecha inválida');
    }

    const [year, month, day] = partes.map(Number);
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      month < 1 || month > 12 ||
      day < 1 || day > 31
    ) {
      throw new Error('Fecha inválida');
    }

    const fechaBase = new Date(year, month - 1, day); // fecha local
    // Verificar que JS no haya "corregido" una fecha inválida
    if (
      fechaBase.getFullYear() !== year ||
      fechaBase.getMonth() !== month - 1 ||
      fechaBase.getDate() !== day
    ) {
      throw new Error('Fecha inválida');
    }

    const diaSemana = fechaBase.getDay(); // 0=domingo, 1=lunes, ... 6=sábado

    const horario = await AgendasMedicos.findOne({ medico: medicoId, diaSemana });

    // Si el médico no atiende ese día
    if (!horario) {
      return {
        medicoId,
        fecha,
        duracionMin: null,
        slotsLibres: []
      };
    }

    const todosSlots = generarSlots(
      horario.horaInicio,
      horario.horaFin,
      horario.duracionTurnoMin,
      fechaBase
    );

    const inicioDia = new Date(fechaBase);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fechaBase);
    finDia.setHours(23, 59, 59, 999);

        const reservasDia = await ReservaTurno.find({
      medico: medicoId,
      fecha: { $gte: inicioDia, $lte: finDia },
      estado: { $ne: 'cancelado' }
    }).select('fecha');

    const ocupadas = new Set(reservasDia.map(r => r.fecha.getTime()));
    const libres = todosSlots.filter(d => !ocupadas.has(d.getTime()));

    return {
      medicoId,
      fecha,
      duracionMin: horario.duracionTurnoMin,
      slotsLibres: libres
    };
  }

  static async reservarTurnoAgenda({ pacienteId, medicoId, fechaHora, motivo }) {
    if (!pacienteId || !medicoId || !fechaHora) {
      throw new Error('pacienteId, medicoId y fechaHora son obligatorios');
    }

    const paciente = await pacienteModelo.findById(pacienteId);
    if (!paciente) {
      throw new Error(`Paciente con ID ${pacienteId} no existe.`);
    }

    const medico = await empleadoModelo.findById(medicoId);
    if (!medico) {
      throw new Error(`Empleado/Médico con ID ${medicoId} no existe.`);
    }

    const fecha = new Date(fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      throw new Error('fechaHora inválida');
    }

    const diaSemana = fecha.getDay();
    const horario = await AgendasMedicos.findOne({ medico: medicoId, diaSemana });
    if (!horario) {
      throw new Error('El médico no atiende en la fecha seleccionada.');
    }

    // Control: que la hora caiga en uno de los slots definidos
    const todosSlots = generarSlots(
      horario.horaInicio,
      horario.horaFin,
      horario.duracionTurnoMin,
      fecha
    );
    const esSlotValido = todosSlots.some(s => s.getTime() === fecha.getTime());
    if (!esSlotValido) {
      throw new Error('La hora seleccionada no coincide con un turno disponible.');
    }

    // Verificar que no haya ya una reserva en ese horario
    const reservaExistente = await ReservaTurno.findOne({
      medico: medicoId,
      fecha,
      estado: { $ne: 'cancelado' }
    }); 

    if (reservaExistente) {
      throw new Error('Ese horario ya está reservado.');
    }

    const nuevaReserva = await ReservaTurno.create({
      paciente: pacienteId,
      medico: medicoId,
      fecha,
      motivo
    });


    return nuevaReserva;
  }

    static async crearHorarioMedico({ medicoId, diaSemana, horaInicio, horaFin, duracionTurnoMin }) {
    if (!medicoId || diaSemana === undefined || !horaInicio || !horaFin) {
      throw new Error('medicoId, diaSemana, horaInicio y horaFin son obligatorios');
    }

    const medico = await empleadoModelo.findById(medicoId);
    if (!medico) {
      throw new Error(`Empleado/Médico con ID ${medicoId} no existe.`);
    }

    const d = Number(diaSemana);
    if (Number.isNaN(d) || d < 0 || d > 6) {
      throw new Error('diaSemana debe estar entre 0 (domingo) y 6 (sábado)');
    }

    const duracion = duracionTurnoMin ?? 30;

    if (horaInicio >= horaFin) {
      throw new Error('horaInicio debe ser anterior a horaFin');
    }

    try {
      const horario = await AgendasMedicos.create({
        medico: medicoId,   // asumiendo que en el schema el campo se llama "medico"
        diaSemana: d,
        horaInicio,
        horaFin,
        duracionTurnoMin: duracion
      });
      return horario;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Ya existe un horario para ese médico en ese día de la semana');
      }
      throw error;
    }
  }

  static async listarHorariosMedico(medicoId) {
    if (!medicoId) {
      throw new Error('medicoId es obligatorio');
    }

    const medico = await empleadoModelo.findById(medicoId);
    if (!medico) {
      throw new Error(`Empleado/Médico con ID ${medicoId} no existe.`);
    }

    const horarios = await AgendasMedicos.find({ medico: medicoId })
      .sort({ diaSemana: 1, horaInicio: 1 });

    return horarios;
  }

    static async listarTurnosDia({ fecha, medicoId = null, soloPresentes = false }) {
    if (!fecha) {
      throw new Error('fecha es obligatoria');
    }

    // Validación fuerte de fecha YYYY-MM-DD
    const partes = fecha.split('-');
    if (partes.length !== 3) {
      throw new Error('Fecha inválida');
    }

    const [year, month, day] = partes.map(Number);
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      month < 1 || month > 12 ||
      day < 1 || day > 31
    ) {
      throw new Error('Fecha inválida');
    }

    const fechaBase = new Date(year, month - 1, day);
    if (
      fechaBase.getFullYear() !== year ||
      fechaBase.getMonth() !== month - 1 ||
      fechaBase.getDate() !== day
    ) {
      throw new Error('Fecha inválida');
    }

    const inicioDia = new Date(fechaBase);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fechaBase);
    finDia.setHours(23, 59, 59, 999);

    const filtro = {
      fecha: { $gte: inicioDia, $lte: finDia }
    };

    if (medicoId) {
      filtro.medico = medicoId;
    }

    // Por ahora consideramos "presentes" = estado 'confirmado'
    if (soloPresentes) {
      filtro.estado = 'confirmado';
    }

    const turnos = await ReservaTurno.find(filtro)
      .populate('paciente')
      .populate('medico')
      .sort({ fecha: 1 });

    return turnos;
  }

}

  function generarSlots(horaInicioStr, horaFinStr, duracionMin, fechaBase) {
    const [hIni, mIni] = horaInicioStr.split(':').map(Number);
    const [hFin, mFin] = horaFinStr.split(':').map(Number);

    const slots = [];

    let actual = new Date(fechaBase);
    actual.setHours(hIni, mIni, 0, 0);

    const fin = new Date(fechaBase);
    fin.setHours(hFin, mFin, 0, 0);

    while (actual < fin) {
      slots.push(new Date(actual)); // copiamos la fecha
      actual = new Date(actual.getTime() + duracionMin * 60000);
    }

    return slots;
  }
  


export default TurnosService;