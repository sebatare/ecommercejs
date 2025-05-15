const express = require('express');
const authenticate = require('../../middleware/authenticate');

function createProductRouter(service) {
    const router = express.Router();

    router.get('/', async (req, res) => res.json(await service.getAll()));
    router.get('/:id', async (req, res) => res.json(await service.getById(req.params.id)));

    // Proteger solo crear, actualizar y eliminar
    router.post('/', authenticate, async (req, res) => res.status(201).json(await service.create(req.body)));
    router.put('/:id', authenticate, async (req, res) => res.json(await service.update(req.params.id, req.body)));
    router.delete('/:id', authenticate, async (req, res) => {
        await service.delete(req.params.id);
        res.status(204).send();
    });

    return router;
}

module.exports = createProductRouter;
