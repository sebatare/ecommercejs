const express = require('express');

function createCartRouter(service) {
    const router = express.Router();

    router.post('/create', async (req, res) => {
        const userId = req.user?.id;

        try {
            const cart = await service.createCart(userId);
            res.status(201).json(cart);
        } catch (error) {
            if (error.name === 'CartValidationError') {
                return res.status(400).json({
                    error: error.message,
                    field: error.field
                });
            }
            console.error(error);

            res.status(500).json({ error: 'Error interno', details: error.message });
        }
    });

    router.get('/', async (req, res) => {
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({ error: 'No jnkjnkjnkjn' })
        }

        try {
            const cart = await service.getCart(userId)
            res.status(200).json(cart)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'No se pudo obtener el carrito' })
        }
    })

    router.put('/update-cart', async (req, res) => {
        const userId = req.user?.id
        const updates = req.body.items

        if (!userId) {
            return res.status(401).json({ error: 'No autorizado' })
        }

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'El body debe tener un array "items"' })
        }

        try {
            const cart = await service.getCart(userId)
            await service.updateItems(cart.id, updates)
            res.status(200).json({ success: true })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'No se pudo actualizar el carrito' })
        }
    })

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