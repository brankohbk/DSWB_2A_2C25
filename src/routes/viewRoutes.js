import { Router } from "express";
import { Empleado } from "../models/Empleado.js";
import { Turno } from "../models/Turno.js";

const router = Router();

// Home (vista)
router.get('/', (req, res) => res.render('home', { title: 'Clínica Salud Integral', msg: 'Servidor funcionando' }));

// Empleados (vistas)
router.get('/empleados', async (req, res, next) => {
    try {
        const empleados = await Empleado.getAll();
        res.render('empleados/list', { title: 'Empleados', empleados, ok: req.query.ok });
    } catch (e) { next(e); }
});

router.get('/empleados/nuevo', (req, res) => {
    res.render('empleados/new', { title: 'Nuevo empleado' });
});

router.get('/empleados/:id/editar', async (req, res, next) => {
    try{
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) return res.status(404).render('404', { title:'Empleado inexistente' });
        res.render('empleados/edit', { title: 'Editar empleado', empleado });
    } catch (e) {
        next(e);
    }
});



// Turnos (vistas)
router.get('/turnos', async (req, res,next) => {
    try{
        const turnos = await Turno.getAll();
        res.render('turnos/list', { title: 'Turnos', turnos, ok: req.query.ok });
    } catch (e) {
        next(e);
    }
    
});

router.get('/turnos/nuevo', (req, res) => {
    res.render('turnos/new', { title: 'Nuevo turno' });
});

router.get('/turnos/:id/actualizar', async (req, res, next) => {
    try{
        const turno = await Turno.getById(req.params.id);
        if (!turno) return res.status(404).render('404', { title:'Turno inexistente' });
        res.render('turnos/actualizar', { title: 'Actualizar turno', turno});
    } catch (e) {
        next(e);
    }
});

export default router;