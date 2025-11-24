export const isAuthenticated = (req, res, next) => {
    // Verificamos si existe la sesión y el usuario dentro de ella
    if (req.session && req.session.user) {
        return next(); // El usuario está logueado, pase.
    }
    // Si no, lo mandamos al login
    res.redirect('/auth/login');
};

// Middleware para pasar el usuario a todas las vistas (para el nav, por ejemplo)
export const userToViews = (req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
};