const express = require('express');
const NotAuthorizedError = require('../../domain/errors/NotAuthorizedError');

function createCartRouter(service) {
    const router = express.Router();

    router.post('/create', async (req, res) => {
        const userId = req.user?.id;
        try {
            const cart = await service.createCart(userId);
            res.status(201).json(cart);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo crear el carrito' });
        }
    });

    router.put('/update-items', async (req, res) => {
        const userId = req.user?.id;
        const updates = req.body.items; // [{ productId, delta }]

        try {
            const cart = await service.getOrCreateCart(userId); // ← método que tú mencionaste antes
            await service.updateItems(cart.id, updates);
            res.status(200).json({ message: 'Carrito actualizado correctamente' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo actualizar el carrito' });
        }
    });


    router.get('/get-all-carts', async (req, res) => {

        try {
            const carts = await service.getAllCarts();
            res.status(200).json(carts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudieron obtener los carritos' });
        }
    });

    return router;
}

module.exports = createCartRouter;