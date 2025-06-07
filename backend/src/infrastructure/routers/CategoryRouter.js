const express  = require('express');
function createCategoryRouter(repository) {
    const router = express.Router();

    // Rutas para obtener todas las categorías y por ID
    router.get('/', async (req, res) => res.json(await repository.getAll()));
    router.get('/:id', async (req, res) => res.json(await repository.getById(req.params.id)));

    // Proteger solo crear, actualizar y eliminar
    router.post('/', async (req, res) => res.status(201).json(await repository.create(req.body)));
    router.put('/:id', async (req, res) => res.json(await repository.update(req.params.id, req.body)));
    router.delete('/:id', async (req, res) => {
        await repository.delete(req.params.id);
        res.status(204).send();
    });

    return router;
}

module.exports = createCategoryRouter;