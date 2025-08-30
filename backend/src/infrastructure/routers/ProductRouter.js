const express = require('express');

function createProductRouter(service) {
    const router = express.Router();

    router.get('/', async (req, res) => res.json(await service.getAll()));
    router.get('/:id', async (req, res) => res.json(await service.getById(req.params.id)));

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
