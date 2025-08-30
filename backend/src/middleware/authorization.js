/**
 * Middleware para verificar si el usuario tiene el rol requerido.
 * @param {string} requiredRole - El rol necesario (ej: 'admin', 'user').
 * @returns {Function} Express middleware.
 */
function authorize(requiredRole) {
    return (req, res, next) => {
        // Asegurarse de que el usuario está autenticado (req.user existe)
        if (!req.user) {
            return res.status(401).json({ message: 'Inicio de sesión requerida' });
        }

        // Verificar si el rol del usuario coincide con el rol requerido
        if (req.user.role === requiredRole) {
            // Si el rol es correcto, continuar a la siguiente función
            next();
        } else {
            // Si el rol no es correcto, enviar un error de acceso prohibido
            res.status(403).json({ message: 'No tiene accesso a está función' });
        }
    };
}

module.exports = authorize;