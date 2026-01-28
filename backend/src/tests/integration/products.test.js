// src/tests/integration/products.test.js
const request = require('supertest');
const app = require('../../main');

//jest.setTimeout(10000); // 10s por si alguna operación tarda

describe('Products API - Integration', () => {

    describe('GET /api/products', () => {
        it('Debe retornar todos los productos', async () => {

            const res = await request(app).get('/api/products');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('Retornar {id - name - price - stock} todos los productos ', async () => {
            const res = await request(app).get('/api/products');

            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('price');
            expect(res.body[0]).toHaveProperty('stock');
        });

        it('Debe retornar un producto de ID 1 con todos sus atributos', async () => {
            const productId = 1; // Asumiendo que este ID existe en DB seeded
            const res = await request(app)
                .get(`/api/products/${productId}`)
                .expect(200);

            expect(res.body).toHaveProperty('id', productId);
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('description');
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('price');
            expect(res.body).toHaveProperty('stock');
            expect(res.body).toHaveProperty('discountPercentage');
            expect(res.body).toHaveProperty('imageUrl');
            expect(res.body).toHaveProperty('categories');
        });
    });

    describe('POST /api/products', () => {
        it('Debe crear un producto como Admin', async () => {
            // Login como admin
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@test.com',
                    password: 'Admin123!',
                });
            const token = loginRes.body.token;

            const newProduct = {
                name: 'Webcam HD',
                description: 'Webcam 1080p',
                price: 59.99,
                stock: 20,
            };

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send(newProduct)
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe(newProduct.name);
            expect(res.body.description).toBe(newProduct.description);
            expect(new Date(res.body.createdAt).toString()).not.toBe('Invalid Date');

            expect(res.body.price).toBe(newProduct.price);
            expect(res.body.stock).toBe(newProduct.stock);

            expect(res.body.discountPercentage).toBe(0);
            expect(res.body.imageUrl).toBe('/default');

            expect(res.body.categories).toEqual([]);
            



        });
    });

    describe('PUT /api/products/:id', () => {
        it('should update an existing product', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@test.com',
                    password: 'Admin123!',
                });
            const token = loginRes.body.token;

            const updates = { price: 899.99, stock: 5 };

            const res = await request(app)
                .put('/api/products/1')
                .set('Authorization', `Bearer ${token}`)
                .send(updates)
                .expect(200);

            expect(Number(res.body.price)).toBe(updates.price);
            expect(res.body.stock).toBe(updates.stock);
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should delete a product', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@test.com',
                    password: 'Admin123!',
                });
            const token = loginRes.body.token;

            // Crear producto temporal para borrar
            const createRes = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Producto temporal',
                    description: 'Solo para test',
                    price: 10,
                    stock: 1,
                });
            const productId = createRes.body.id;

            // Borrar el producto
            await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204); // 204 No Content es correcto para DELETE

            // Verificar que ya no exista
            await request(app)
                .get(`/api/products/${productId}`)
                .expect(404);
        });
    });

});
