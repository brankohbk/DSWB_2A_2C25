// src/controllers/registroViewsController.js
export const mostrarFormulario = (req, res) => {
    res.render('registro/registro', { 
        title: 'Registro de paciente'
    });
};
