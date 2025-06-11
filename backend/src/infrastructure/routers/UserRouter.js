const express = require('express');
const { body, validationResult } = require('express-validator');

function createUserRouter(userRepository) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const users = await userRepository.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.put('/setrole', async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const user = await userRepository.setRole(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    })
    //borrar por correo
    router.delete('/', async (req, res) => {
        try {
            const { email } = req.body;
            console.log(email);
            if (!email) return res.status(400).json({ error: 'Email is required' });

            const user = await userRepository.deleteByEmail(email);

            res.json({ message: 'User deleted successfully', user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;

}

module.exports = createUserRouter;