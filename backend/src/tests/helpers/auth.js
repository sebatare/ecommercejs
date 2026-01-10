const request = require('supertest');
const app = require('../../main');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

// Crear token para tests con datos por defecto
function createToken(overrides = {}) {
    return jwt.sign({
        id: 1,
        email: 'test@correo.com',
        role: 1,
        name: 'Test User',
        ...overrides
    }, SECRET);
}

// Token sin campo role (para tests de error)
function createTokenWithoutRole() {
    return jwt.sign({ id: 1, email: 'test@correo.com', name: 'Test User' }, SECRET);
}

// Helper para crear carrito en tests
async function createCart(token) {
    return await request(app)
        .post('/api/cart/create')
        .set('Authorization', `Bearer ${token}`);
}

module.exports = { createToken, createTokenWithoutRole, createCart };
