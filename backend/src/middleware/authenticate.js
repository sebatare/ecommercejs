const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload; // queda disponible en los controladores
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = authenticate;
