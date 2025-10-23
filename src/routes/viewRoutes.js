import { Router } from "express";
import empleadoModelo from "../models/Empleado.js";
import turnoModelo from "../models/Turno.js";
import pacienteModelo from "../models/Paciente.js";

const router = Router();

// Home (vista)
router.get('/', (req, res) => res.render('home', { title: 'Inicio', msg: 'Seleccione una sección de la barra superior para navegar hasta ella.' }));

// Empleados (vistas)
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
    try{
        const empleado = await empleadoModelo.findById(req.params.id);
        if (!empleado) return res.status(404).render('404', { title:'Empleado inexistente' });
        res.render('empleados/edit', { title: 'Editar empleado', empleado });
    } catch (e) {
        next(e);
    }
});



// Turnos (vistas)
router.get('/turnos', async (req, res,next) => {
    try{
        const turnos = await turnoModelo.getAll();
        res.render('turnos/list', { title: 'Turnos', turnos, ok: req.query.ok });
    } catch (e) {
        next(e);
    }
    
});

router.get('/turnos/nuevo', async (req, res, next) => {    
    try{
        const empleados = await empleadoModelo.getAll();
        res.render('turnos/new', { title: 'Nuevo turno', empleados, ok: req.query.ok });
    } catch (e) {
        next(e);
    }
});

router.get('/turnos/:id/actualizar', async (req, res, next) => {
    try{
        const empleados = await empleadoModelo.getAll();
        const turno = await turnoModelo.getById(req.params.id);
        if (!turno) return res.status(404).render('404', { title:'Turno inexistente' });
        res.render('turnos/actualizar', { title: 'Actualizar turno', turno, empleados});
    } catch (e) {
        next(e);
    }
});

// Pacientes (vistas)
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
    try{
        const paciente = await pacienteModelo.findById(req.params.id);
        if (!paciente) return res.status(404).render('404', { title:'Paciente inexistente' });
        res.render('pacientes/edit', { title: 'Editar paciente', paciente });
    } catch (e) {
        next(e);
    }
});

export default router;