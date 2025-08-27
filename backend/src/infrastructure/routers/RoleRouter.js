const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization');
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

    router.delete('/:id', authenticate,authorize('admin'), async (req, res, next) => {
        try {
            console.log("DELETE /roles/:id called");
            const id = parseInt(req.params.id);
            await service.delete(id);
            res.json({ message: 'Rol eliminado' });
        } catch (error) {
            next(error);
        }
    });


    return router;
}

module.exports = createRoleRouter;