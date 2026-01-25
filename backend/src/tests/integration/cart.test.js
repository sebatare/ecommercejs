// src/tests/integration/cart.test.js
const request = require('supertest');
const app = require('../../main');

describe('Pruebas de integracion del carrito', () => {
    let userToken;

    beforeAll(async () => {
        // ============================
        // Crear un usuario real para la integración
        // ============================
        const name = 'Cart User';
        const email = `cartuser${Date.now()}@test.com`; // email único por test run
        const password = 'Password123!'; // password válido según tu servicio
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({ name, email, password });

        userToken = registerRes.headers['set-cookie']
            .find(cookie => cookie.startsWith('auth='))
            .split(';')[0]
            .split('=')[1];
    });

    describe('POST /api/cart/create', () => {

        it('Debe retornar 401 si no se proporciona token al crear carrito', async () => {
            const res = await request(app)
                .post('/api/cart/create'); // sin token

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });
    });

    // ============================
    // OBTENER CARRITO
    // ============================
    describe('GET /api/cart', () => {
        it('Retorna correctamente carrito de un usuario con el token', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Cookie', `auth=${userToken}`);

            expect(res.status).toBe(200); // debe devolver 200 OK
            expect(res.body).toHaveProperty('id');
        });

        it('Retorna 401 si no se proporciona token al pedir un carrito', async () => {
            const res = await request(app)
                .get('/api/cart'); // sin token

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });
    });
});
