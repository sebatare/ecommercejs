const express = require('express');
const { body, validationResult } = require('express-validator');

function createAuthRouter(authService) {
    const router = express.Router();

    router.post('/register',
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            try {
                const user = await authService.register(req.body);
                res.status(201).json(user);
            } catch (err) {
                res.status(400).json({ error: err.message });
            }
        });

    router.post('/login',
        body('email').isEmail(),
        body('password').notEmpty(),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            try {
                const { token, user } = await authService.login(req.body);
                res.json({ token, user });
            } catch (err) {
                res.status(404).json({ error: err.message });
            }
        });


    return router;
}

module.exports = createAuthRouter;
