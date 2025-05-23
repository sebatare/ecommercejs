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

    return router;

}

module.exports = createUserRouter;