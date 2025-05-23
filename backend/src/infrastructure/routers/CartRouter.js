const express = require('express');
const NotAuthorizedError = require('../../domain/errors/NotAuthorizedError');

function createCartRouter(service) {
    const router = express.Router();

    //create cart
    router.post('/create', async (req, res) => {
        const userId = req.user.id;
        console.log('req.user:', req.user); // <- ¿llega el usuario?
        try {
            const cart = await service.createCart(userId);
            console.log('Carrito de compras creado:', cart);
            res.status(201).json(cart);
        } catch (error) {
            if (error instanceof NotAuthorizedError) {
                return res.status(error.statusCode).json({ 'error.message': error.message });
            }   
            res.status(500).json({ error: 'Error creating cart' });
        }
    });

    router.post('/add', async (req, res) => {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        try {
            await service.addItemToCart(userId, productId, quantity);
            res.status(201).json({ message: 'Item added to cart' });
        } catch (error) {
            if (error instanceof NotAuthorizedError) {
                return res.status(error.statusCode).json({ 'error.message': error.message });
            }
            res.status(500).json({ error: 'Error adding item to cart' });
        }
    });

    return router;
}

module.exports = createCartRouter;