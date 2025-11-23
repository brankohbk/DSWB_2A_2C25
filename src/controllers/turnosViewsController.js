import TurnosService from '../services/TurnosService.js';
import empleadoModelo from '../models/Empleado.js';
import AgendasMedicos from '../models/AgendasMedicos.js';

function hoyYYYYMMDD() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

class TurnosViewsController {
    static async agenda(req, res) {
        try {
        // Adaptá esto a cómo guardás el usuario logueado
        const usuario = req.user || null;

        const medicos = await empleadoModelo.getAll();

        const fechaSeleccionada = req.query.fecha || hoyYYYYMMDD();
        const medicoIdParam = req.query.medicoId || '';

        // Disponibilidad de turnos (para paciente / admin)
        let disponibilidad = null;
        let medicoSeleccionado = null;

        if (medicoIdParam && fechaSeleccionada) {
            disponibilidad = await TurnosService.obtenerHorariosDisponibles({
            medicoId: medicoIdParam,
            fecha: fechaSeleccionada
            });
            medicoSeleccionado = medicos.find(
            m => m._id.toString() === medicoIdParam
            ) || null;
        }

        // Turnos del día (para médico y administrativo)
        let turnosDia = [];
        if (usuario && (usuario.rol === 'medico' || usuario.rol === 'administrativo')) {
            const medicoIdFiltro =
            usuario.rol === 'medico' ? usuario._id.toString() : null;

            turnosDia = await TurnosService.listarTurnosDia({
            fecha: fechaSeleccionada,
            medicoId: medicoIdFiltro,
            soloPresentes: false
            });
        }

        // Agendas de médicos (solo administrativo)
        let agendas = [];
        if (usuario && usuario.rol === 'administrativo') {
            agendas = await AgendasMedicos.find()
            .populate('medico')
            .sort({ 'medico.nombre': 1, diaSemana: 1, horaInicio: 1 });
        }

        res.render('agenda_turnos', {
            usuario,
            medicos,
            fechaSeleccionada,
            medicoSeleccionado,
            disponibilidad,
            turnosDia,
            agendas
        });
        } catch (err) {
        console.error(err);
        res.status(500).render('500', { title: 'Error', err });
        }
    }

    static async presentes(req, res) {
        try {
        const usuario = req.user || null;
        const fechaSeleccionada = req.query.fecha || hoyYYYYMMDD();

        const medicoId =
            usuario && usuario.rol === 'medico'
            ? usuario._id.toString()
            : (req.query.medicoId || null);

        const turnos = await TurnosService.listarTurnosDia({
            fecha: fechaSeleccionada,
            medicoId,
            soloPresentes: true
        });

        res.render('turnos_presentes', {
            usuario,
            fechaSeleccionada,
            turnos
        });
        } catch (err) {
        console.error(err);
        res.status(500).render('500', { title: 'Error', err });
        }
    }
}

export default TurnosViewsController;
