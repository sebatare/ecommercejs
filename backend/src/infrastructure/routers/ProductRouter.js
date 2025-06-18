const express = require('express');

function createProductRouter(service) {
    const router = express.Router();

    router.get('/', async (req, res) => res.json(await service.getAll()));
    router.get('/:id', async (req, res) => res.json(await service.getById(req.params.id)));

    // Proteger solo crear, actualizar y eliminar
    router.post('/', async (req, res) => res.status(201).json(await service.create(req.body)));
    //eliminar productos con x cantidad
    router.put('/:id/:quantity', async (req, res) => {
        console.log(`ROUTER: ${req.params.id} en cantidad: ${req.params.quantity}`);
        await service.deleteByQuantity(req.params.id, req.params.quantity);
        res.status(204).send();
    });

    router.put('/:id', async (req, res) => res.json(await service.update(req.params.id, req.body)));
    router.delete('/:id', async (req, res) => {
        await service.delete(req.params.id);
        res.status(204).send();
    });


    return router;
}

module.exports = createProductRouter;
