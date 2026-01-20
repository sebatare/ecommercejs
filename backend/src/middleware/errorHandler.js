// middleware/errorHandler.js
const NotFoundError = require('../domain/errors/NotFoundError');

function errorHandler(err, req, res, next) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    // Si el error viene de PostgreSQL por restricción UNIQUE
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un carrito para este usuario' });
    }

    // Otros errores definidos con mensaje
    if (err.message) {
        return res.status(400).json({ error: err.message });
    }

    // Fallback genérico
    res.status(500).json({ error: 'Error del servidor' });
}

module.exports = errorHandler;
