const express = require('express');
const request = require('supertest');
const CartService = require('../../src/application/services/CartService');
const createCartRouter = require('../../src/infrastructure/routers/CartRouter');
const NotAuthorizedError = require('../../src/domain/errors/NotAuthorizedError');

describe('cartService', () => {
    describe('crearCarrito', () => {
        it('crea un carrito de compras vacío', async () => {
            const cart = {
                id: 1,
                userId: 1,
                createdAt: expect.any(Date),
                items: []
            };

            const mockRepository = {
                createCart: jest.fn().mockResolvedValue(cart)
            };

            const service = new CartService(mockRepository);

            const result = await service.createCart(cart.userId);

            expect(mockRepository.createCart).toHaveBeenCalledWith(cart.userId);
            expect(result).toMatchObject(cart);
        });
    });

    describe('create cart without logged in user', () => {
        let app;

        beforeAll(() => {
            app = express();
            app.use(express.json());

            // Simulamos req.user sin id → userId = undefined
            app.use((req, res, next) => {
                req.user = {}; // SIN id
                next();
            });

            const mockService = {
                createCart: jest.fn((userId) => {
                    if (!userId) throw new NotAuthorizedError();
                }),
            };

            const router = createCartRouter(mockService);
            app.use('/cart', router);
        });

        it('debería responder 401 si req.user.id no está definido', async () => {
            const res = await request(app).post('/cart/create');

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({ 'error.message': 'No tiene acceso a este recurso' });
        });
    });
});
