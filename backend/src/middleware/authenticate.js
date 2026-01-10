const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Auth header no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SECRET);
        if (!payload.role) {
            return res.status(401).json({ error: 'Token inválido: falta role' });
        }
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
}

module.exports = authenticate;


