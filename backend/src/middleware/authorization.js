/**
 * Middleware para verificar si el usuario tiene el rol requerido.
 * 
 * IMPORTANTE: Este middleware debe usarse DESPUÉS de authenticate.
 * El token JWT debe incluir el rol del usuario (se incluye automáticamente en AuthService.login).
 * 
 * Uso en routers:
 *   router.put('/:id', authenticate, authorize('admin'), handler);
 * 
 * @param {string} requiredRole - El rol necesario (ej: 'admin', 'user').
 * @returns {Function} Express middleware.
 */
function authorize(requiredRole) {
    return (req, res, next) => {
        // Asegurarse de que el usuario está autenticado (req.user existe)
        // Esto debería estar garantizado por el middleware authenticate
        if (!req.user) {
            return res.status(401).json({ 
                error: 'No autorizado. Token de autenticación requerido.' 
            });
        }

        // Verificar si el token incluye el rol
        if (!req.user.role) {
            return res.status(403).json({ 
                error: 'Token inválido: no incluye información de rol. Por favor, inicia sesión nuevamente.' 
            });
        }

        // Verificar si el rol del usuario coincide con el rol requerido
        if (req.user.role === requiredRole) {
            // Si el rol es correcto, continuar a la siguiente función
            next();
        } else {
            // Si el rol no es correcto, enviar un error de acceso prohibido
            res.status(403).json({ 
                error: `Acceso denegado. Se requiere rol '${requiredRole}', pero el usuario tiene rol '${req.user.role}'` 
            });
        }
    };
}

module.exports = authorize;