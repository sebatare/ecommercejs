// infrastructure/routers/UserRouter.js

const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorization');
const { body, validationResult } = require('express-validator');

function createUserRouter(userService) {
    const router = express.Router();

    router.get('/', async (req, res, next) => {
        try {
            // El router pide la lista al servicio
            const users = await userService.findAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    });

    // Se mantiene el middleware para seguridad
    router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
        try {
            const userId = parseInt(req.params.id);
            const updatedData = req.body;
            const currentUser = req.user;

            // Se llama al servicio y se le pasa el usuario actual
            const user = await userService.update(userId, updatedData, currentUser);

            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    });

    //borrar por correo
    router.delete('/', async (req, res) => {
        try {
            const { email } = req.body;
            
            if (!email) return res.status(400).json({ error: 'Email is required' });

            const user = await userService.deleteByEmail(email);

            res.json({ message: 'User deleted successfully', user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}

module.exports = createUserRouter;