import { Router } from "express";
import empleadoModelo from "../models/Empleado.js";
import turnoModelo from "../models/Turno.js";
import pacienteModelo from "../models/Paciente.js";
import TurnosService from "../services/TurnosService.js";
import insumoModelo from "../models/Insumo.js";
import resultadoEstudioModelo from "../models/ResultadoEstudio.js";
import TurnosViewsController from "../controllers/turnosViewsController.js";
// import { mostrarFormulario } from "../controllers/registroViewsController.js";

const router = Router();

// Home (vista)
router.get('/', (req, res) =>
    res.render('home', {
        title: 'Inicio',
        msg: 'Seleccione una sección de la barra superior para navegar hasta ella.'
    })
    );

// ========= EMPLEADOS (vistas) =========
router.get('/empleados', async (req, res, next) => {
    try {
        const empleados = await empleadoModelo.getAll();
        res.render('empleados/list', { title: 'Empleados', empleados, ok: req.query.ok });
    } catch (e) { next(e); }
});

router.get('/empleados/nuevo', (req, res) => {
    res.render('empleados/new', { title: 'Nuevo empleado' });
});

router.get('/empleados/:id/editar', async (req, res, next) => {
    try {
        const empleado = await empleadoModelo.findById(req.params.id);
        if (!empleado) return res.status(404).render('404', { title: 'Empleado inexistente' });
        res.render('empleados/edit', { title: 'Editar empleado', empleado });
    } catch (e) {
        next(e);
    }
    });

// ========= TURNOS (vistas) =========

// Turnos (vistas)
router.get('/turnos', async (req, res,next) => {
    try{
      //const turnos = await turnoModelo.getAll();
        const turnosConDetalle = await TurnosService.listarTurnosConDetalle();
        res.render('turnos/list', {
        title: 'Turnos',
        turnos: turnosConDetalle,
        ok: req.query.ok
        });
    } catch (e) {
        next(e);
    }
    
});

/* Esta ruta ahora decide QUÉ ver según el rol del usuario
router.get('/turnos', async (req, res, next) => {
    try {
        const usuario = req.session.user || null;
        const rol = usuario?.rol || null;

        // 1) Paciente -> solo agenda de turnos disponibles
        if (rol === 'paciente') {
        // reutilizamos la lógica de agenda
        return TurnosViewsController.agenda(req, res, next);
        }

    // 2) Médico -> agenda + listado del día (ya lo resuelve TurnosViewsController.agenda)
    if (rol === 'medico' || rol === 'jefe_medico') {
        return TurnosViewsController.agenda(req, res, next);
        }

        // 3) Administrativo / jefes / gerente -> listado completo de turnos clásicos
        const turnosConDetalle = await TurnosService.listarTurnosConDetalle();
        return res.render('turnos/list', {
        title: 'Turnos',
        turnos: turnosConDetalle,
        ok: req.query.ok
        });
    } catch (e) {
        next(e);
    }
});*/

// Formulario clásico de creación de turno (solo tiene sentido para admin / med)
router.get('/turnos/nuevo', async (req, res, next) => {
    try {
        const empleados = await empleadoModelo.getAll();
        const pacientes = await pacienteModelo.getAll();
        res.render('turnos/new', {
        title: 'Nuevo turno',
        empleados,
        pacientes,
        ok: req.query.ok
        });
    } catch (e) {
        next(e);
    }
    });

router.get('/turnos/:id/actualizar', async (req, res, next) => {
    try {
        const empleados = await empleadoModelo.getAll();
        const pacientes = await pacienteModelo.getAll();
        const turno = await turnoModelo.getById(req.params.id);
        if (!turno) return res.status(404).render('404', { title: 'Turno inexistente' });
        res.render('turnos/actualizar', {
        title: 'Actualizar turno',
        turno,
        empleados,
        pacientes
        });
    } catch (e) {
        next(e);
    }
});

// Ruta explícita para la agenda (por si la querés linkear directo)
router.get('/turnos/agenda', TurnosViewsController.agenda);

// ========= PACIENTES (vistas) =========
router.get('/pacientes', async (req, res, next) => {
    try {
        const pacientes = await pacienteModelo.getAll();
        res.render('pacientes/list', { title: 'Pacientes', pacientes, ok: req.query.ok });
    } catch (e) { next(e); }
    });

router.get('/pacientes/nuevo', (req, res) => {
    res.render('pacientes/new', { title: 'Nuevo paciente' });
});

router.get('/pacientes/:id/editar', async (req, res, next) => {
    try {
        const paciente = await pacienteModelo.findById(req.params.id);
        if (!paciente) return res.status(404).render('404', { title: 'Paciente inexistente' });
        res.render('pacientes/edit', { title: 'Editar paciente', paciente });
    } catch (e) {
        next(e);
    }
});

// ========= INSUMOS (vistas) =========
router.get('/insumos', async (req, res, next) => {
    try {
    const insumos = await insumoModelo.find().lean();
    res.render('insumos/list', {
        title: 'Insumos',
        insumos,
        ok: req.query.ok
        });
    } catch (e) {
        next(e);
    }
});

router.get('/insumos/nuevo', (req, res) => {
    res.render('insumos/new', { title: 'Nuevo insumo' });
});

router.get('/insumos/alertas', async (req, res, next) => {
    try {
    const umbralMinimo = req.query.min || 50;
    const alertas = await insumoModelo
        .find({ stock: { $lt: umbralMinimo } })
        .sort({ stock: 1 })
        .lean();

    res.render('insumos/alertas', {
        title: 'Alertas de stock',
        umbralMinimo,
        alertas
    });
    } catch (e) {
        next(e);
    }
});

router.get('/insumos/:id/editar', async (req, res, next) => {
    console.log('DEBUG /insumos/:id/editar', req.params.id);
    try {
    const insumo = await insumoModelo.findById(req.params.id).lean();
    if (!insumo) {
        return res.status(404).render('404', { title: 'Insumo inexistente' });
    }

    res.render('insumos/editar', {
        title: 'Editar insumo',
        insumo
        });
    } catch (e) {
        next(e);
    }
});

// ========= ESTUDIOS =========
router.get('/pacientes/:id/estudios', async (req, res, next) => {
    try {
    const paciente = await pacienteModelo.findById(req.params.id);
    if (!paciente) return res.status(404).render('404', { title: 'Paciente inexistente' });

    const historial = await resultadoEstudioModelo.getByPacienteId(req.params.id);

    res.render('pacientes/estudios_list', {
        title: `Estudios de ${paciente.nombre} ${paciente.apellido}`,
        paciente,
        historial,
        baseUrl: `/files/`
    });
    } catch (e) { next(e); }
});

router.get('/pacientes/:pacienteId/estudios/nuevo', async (req, res, next) => {
    try {
    const paciente = await pacienteModelo.findById(req.params.pacienteId);
    if (!paciente) return res.status(404).render('404', { title: 'Paciente inexistente' });

    const empleados = await empleadoModelo.getAll();

    res.render('pacientes/estudios_new', {
        title: `Cargar Estudio para ${paciente.nombre}`,
        paciente,
        empleados
    });
    } catch (e) { next(e); }
});

// Si quisieras usar el registro como vista común, podrías tener esto aquí:
// router.get("/registro", mostrarFormulario);

export default router;
