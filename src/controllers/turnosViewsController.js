import TurnosService from '../services/TurnosService.js';
import empleadoModelo from '../models/Empleado.js';
import AgendasMedicos from '../models/AgendasMedicos.js';
import moment from 'moment';

function hoyYYYYMMDD() {
    const hoy = new Date();
    const y = hoy.getFullYear();
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    const d = String(hoy.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

class TurnosViewsController {
    static async agenda(req, res) {
        try {
            const usuario = req.session.user || null;
            const rol = usuario?.rol || null;

            const esPaciente       = rol === 'paciente';
            const esAdministrativo = rol === 'administrativo' || rol === 'jefe_administrativo';
            const esMedico         = rol === 'medico' || rol === 'jefe_medico';
            const esAdmin          = rol === 'administrador';

            const medicos = await empleadoModelo.getAll();
            const fechaSeleccionada = req.query.fecha || hoyYYYYMMDD();
            const medicoIdParam = req.query.medicoId || '';

            // ==========================
            // PACIENTE / ADMINISTRATIVO: calendario semanal
            // ==========================
            let semana = [];
            if (esPaciente || esAdministrativo || esAdmin) {
                const fechaInicioSemana = moment(fechaSeleccionada).startOf("isoWeek"); // lunes
                for (let i = 0; i < 7; i++) {
                    const dia = fechaInicioSemana.clone().add(i, "days");
                    let medicoIdFiltro = medicoIdParam;
                    // admin puede ver cualquier médico
                    if (esAdmin && !medicoIdFiltro && medicos.length > 0) medicoIdFiltro = medicos[0]._id;

                    const turnosDia = await TurnosService.obtenerHorariosDisponibles({
                        medicoId: medicoIdFiltro,
                        fecha: dia.format("YYYY-MM-DD")
                    });

                    semana.push({
                        fecha: dia.format("YYYY-MM-DD"),
                        nombre: dia.format("dddd DD/MM"),
                        turnos: turnosDia
                    });
                }
            }

            // ==========================
            // MÉDICO / ADMINISTRATIVO / ADMIN: agenda del día
            // ==========================
            let turnosDia = [];
            let medicoIdDia = null;
            if (esMedico || esAdministrativo || esAdmin) {
                medicoIdDia = esMedico ? usuario.empleadoId.toString() : medicoIdParam || (medicos[0]?._id);
                turnosDia = await TurnosService.listarTurnosDia({
                    fecha: fechaSeleccionada,
                    medicoId: medicoIdDia,
                    soloPresentes: false
                });
            }

            res.render('agenda_turnos', {
                title: 'Agenda de Turnos',
                usuario,
                rol,
                esPaciente,
                esMedico,
                esAdministrativo,
                esAdmin,
                medicos,
                fechaSeleccionada,
                medicoIdParam,
                semana,
                turnosDia
            });

        } catch (err) {
            console.error(err);
            res.status(500).render('500', { title: 'Error', err });
        }
    }
}

export default TurnosViewsController;


