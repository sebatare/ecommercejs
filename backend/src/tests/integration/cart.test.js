const request = require('supertest');
const app = require('../../main');
const { createCart, createToken, createTokenWithoutRole } = require('../helpers/auth');

describe('Cart API - Integration', () => {
    it('returns 401 if token has no role', async () => {
        const tokenSinRole = createTokenWithoutRole();
        const res = await request(app)
            .post('/api/cart/create')
            .set('Authorization', `Bearer ${tokenSinRole}`);
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Token inválido: falta role');
    });

    it('creates a new cart', async () => {
        const token = createToken();
        const res = await request(app)
            .post('/api/cart/create')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.userId).toBe(1);
    });

    it('adds product to cart', async () => {
        const token = createToken();
        await createCart(token);

        await request(app)
            .put('/api/cart/update-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [{ productId: 1, quantity: 1 }] });

        const updatedCart = await request(app)
            .get('/api/cart/get-cart')
            .set('Authorization', `Bearer ${token}`);

        expect(updatedCart.status).toBe(200);
        expect(updatedCart.body.items).toHaveLength(1);
        expect(updatedCart.body.items[0]).toMatchObject({
            productId: 1,
            quantity: 1,
        });
    });

    it('increments product quantity', async () => {
        const token = createToken();
        await createCart(token);

        await request(app)
            .put('/api/cart/update-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [{ productId: 1, quantity: 1 }] });

        await request(app)
            .put('/api/cart/update-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [{ productId: 1, quantity: 2 }] });

        const updatedCart = await request(app)
            .get('/api/cart/get-cart')
            .set('Authorization', `Bearer ${token}`);

        expect(updatedCart.status).toBe(200);
        expect(updatedCart.body.items).toHaveLength(1);
        expect(updatedCart.body.items[0].quantity).toBe(2);
    });

    it('removes product from cart', async () => {
        const token = createToken();
        await createCart(token);

        await request(app)
            .put('/api/cart/update-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [{ productId: 1, quantity: 1 }] });

        let cart = await request(app)
            .get('/api/cart/get-cart')
            .set('Authorization', `Bearer ${token}`);
        expect(cart.body.items).toHaveLength(1);

        await request(app)
            .put('/api/cart/update-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [] });

        const updatedCart = await request(app)
            .get('/api/cart/get-cart')
            .set('Authorization', `Bearer ${token}`);

        expect(updatedCart.status).toBe(200);
        expect(updatedCart.body.items).toHaveLength(0);
    });

    describe('Cart API - Error handling', () => {
        it('returns 401 if no token provided', async () => {
            const res = await request(app)
                .post('/api/cart/create');

            expect(res.status).toBe(401);
        });

        it('returns 404 if product does not exist', async () => {
            const token = createToken();
            await createCart(token);

            const res = await request(app)
                .put('/api/cart/update-cart')
                .set('Authorization', `Bearer ${token}`)
                .send({ items: [{ productId: 9999, quantity: 1 }] });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });

        it('returns 400 if quantity is invalid', async () => {
            const token = createToken();
            await createCart(token);

            const res = await request(app)
                .put('/api/cart/update-cart')
                .set('Authorization', `Bearer ${token}`)
                .send({ items: [{ productId: 1, quantity: -1 }] });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });
});
