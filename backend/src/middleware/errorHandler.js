// middleware/errorHandler.js
const NotFoundError = require('../domain/errors/NotFoundError');

function errorHandler(err, req, res, next) {
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Error del servidor' });
}

module.exports = errorHandler;
