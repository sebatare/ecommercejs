const request = require('supertest');
const app = require('../../main');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;



// Helper para crear carrito en tests
async function createCart(token) {
    return await request(app)
        .post('/api/cart/create')
        .set('Cookie', `auth=${token}`)
}

async function createValidUser() {
    const name = 'Test User';
    const email = `testuser${Date.now()}@test.com`;
    const password = 'Password123!';

    const res = await request(app)
        .post('/api/auth/register')
        .send({ name, email, password });
    const user = res.body.user;

    return user;
}

module.exports = { createToken, createCart };
