// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
    // ⚠️ CAMBIO: Leer directamente de req.cookies (sin "Bearer ")
    const token = req.cookies.auth;

    if (!token) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const payload = jwt.verify(token, SECRET);

        if (!payload.role) {
            return res.status(401).json({ error: 'No tiene rol' });
        }

        req.user = payload; // Contiene userId, role, email, etc.
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = authenticate;