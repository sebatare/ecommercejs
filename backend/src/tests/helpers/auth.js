const request = require('supertest');
const app = require('../../main');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

// Crear token para tests con datos por defecto
function createToken(overrides = {}) {
    const role = overrides.role || (overrides.roleId === 2 ? 'admin' : 'cliente');
    return jwt.sign({
        id: 1,
        email: 'test@correo.com',
        role: role,
        name: 'Test User',
        ...overrides
    }, SECRET);
}


// Helper para crear carrito en tests
async function createCart(token) {
    return await request(app)
        .post('/api/cart/create')
        .set('Authorization', `Bearer ${token}`);
}

module.exports = { createToken, createCart };
