// src/tests/integration/cart.test.js
const request = require('supertest');
const app = require('../../main');

describe('Cart API - Integration Tests', () => {
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

        userToken = registerRes.body.token; // token JWT generado al registrar
    });

    // ============================
    // CREAR CARRITO
    // ============================
    describe('POST /api/cart/create', () => {
        it('should create a new cart for authenticated user returning 201 and id', async () => {
            const res = await request(app)
                .post('/api/cart/create')
                .set('Authorization', `Bearer ${userToken}`); // token válido
            

            expect(res.status).toBe(201); // debe devolver 201 Created
            expect(res.body).toHaveProperty('id');
        });

        it('should return 401 if no token is provided', async () => {
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
        it('should return the user cart', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${userToken}`); // token válido

            expect(res.status).toBe(200); // debe devolver 200 OK
            expect(res.body).toHaveProperty('id');
        });

        it('should return 401 if token is missing', async () => {
            const res = await request(app)
                .get('/api/cart'); // sin token

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });
    });
});
