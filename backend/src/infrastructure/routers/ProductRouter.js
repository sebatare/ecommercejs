const express = require('express');

function createProductRouter(service) {
    const router = express.Router();

    router.get('/', async (req, res) => res.json(await service.getAll()));
    router.get('/:id', async (req, res, next) => {
        try {
            const product = await service.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    });

    // Proteger al crear productos
    router.post('/', async (req, res, next) => {
        try {

            const created = await service.create(req.body);
            res.status(201).json(created);
        } catch (error) {
            next(error); // Usa el middleware de manejo de errores
        }
    });

    //eliminar productos con x cantidad
    router.put('/:id/:quantity', async (req, res) => {
        await service.deleteByQuantity(req.params.id, req.params.quantity);
        res.status(204).send();
    });

    router.put('/:id', async (req, res) => res.json(await service.update(req.params.id, req.body)));
    
    router.delete('/:id', async (req, res) => {
        await service.delete(req.params.id);
        res.status(204).send();
    });

    router.get('/views/top', async (req, res, next) => {
        try {
            const products = await service.getProductsByView();
            res.json(products);
        } catch (error) {
            next(error); // Usa el middleware de manejo de errores
        }
    });


    return router;
}

module.exports = createProductRouter;
