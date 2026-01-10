const request = require('supertest');
const app = require('../../main');
const { createToken } = require('../helpers/auth');

describe('Products API - Integration', () => {

    describe('GET /api/products', () => {
        it('should return 200 and array of products', async () => {
            const res = await request(app)
                .get('/api/products')
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return products with required fields', async () => {
            const res = await request(app)
                .get('/api/products');

            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('price');
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return product by id', async () => {
            const res = await request(app)
                .get('/api/products/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body.id).toBe(1);
        });

        it('should return 404 if product does not exist', async () => {
            const res = await request(app)
                .get('/api/products/9999');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/products (admin only)', () => {
        it('should return 403 if user is not admin', async () => {
            const token = createToken({ role: 1 }); // role 1 = cliente

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'New Product',
                    price: 100
                });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error');
        });

        it('should create product if user is admin', async () => {
            const token = createToken({ role: 2 }); // role 2 = admin

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Admin Product',
                    price: 150
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('Admin Product');
        });

        it('should return 400 if required fields are missing', async () => {
            const token = createToken({ role: 2 });

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Incomplete Product'
                    // falta price
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    name: 'Product',
                    price: 100
                });

            expect(res.status).toBe(401);
        });
    });
});
