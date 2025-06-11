const express = require('express');
const authenticate = require('../../middleware/authenticate');

function createRoleRouter(service) {
    const router = express.Router();

    router.get('/', async (req, res) => res.json(await service.getAll()));
    router.post('/', async (req, res, next) => {
        try {
            const created = await service.create(req.body);
            res.status(201).json(created);
        } catch (error) {
            next(error); // Usa el middleware de manejo de errores
        }
    });

    router.put('/:id', async (req, res) => res.json(await service.update(req.params.id, req.body)));

    router.delete('/:id', authenticate, async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            await service.delete(id); // simplemente espera que se elimine
            res.json({ message: 'Rol eliminado' }); // respuesta con mensaje
        } catch (error) {
            next(error);
        }
    });


    return router;
}

module.exports = createRoleRouter;