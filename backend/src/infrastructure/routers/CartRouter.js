const express = require('express');

function createCartRouter(service) {
    const router = express.Router();

    router.post('/create', async (req, res, next) => {
        const userId = req.user?.id;
        try {
            const cart = await service.createCart(userId);
            res.status(201).json(cart);
        } catch (error) {
            next(error);
        }
    });

    router.get('/get-cart', async (req, res) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        try {
            const cart = await service.getCart(userId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.status(200).json(cart);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'No se pudo obtener el carrito' });
        }
    });

    router.put('/update-cart', async (req, res) => {
        const userId = req.user?.id;
        const updates = req.body.items;

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'El body debe tener un array "items"' });
        }

        try {
            const cart = await service.getCart(userId);
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