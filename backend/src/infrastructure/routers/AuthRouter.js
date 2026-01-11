const express = require('express');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library')
const authenticate = require('../../middleware/authenticate')
const  RegisteredEmailError  = require('../../domain/errors/auth/RegisteredEmailError');
const  InvalidPasswordError  = require('../../domain/errors/auth/InvalidPasswordError');


function createAuthRouter(authService) {
    const router = express.Router();
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    router.post(
        '/register',
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').notEmpty(), // solo existencia, no complejidad
        async (req, res) => {
            try {
                // Delegación total al service
                const user = await authService.register(req.body);
                return res.status(201).json({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    cart: user.cart,
                    token: user.token
                });
            } catch (err) {
                if (err instanceof InvalidPasswordError) {
                    return res.status(400).json({ error: err.message });
                }
                if (err instanceof RegisteredEmailError) {
                    return res.status(409).json({ error: `El email ${err.email} ya está registrado.` });
                }
                // Errores de negocio genéricos (email duplicado, etc.)
                return res.status(400).json({ error: err.message });
            }
        }
    );

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
                res.status(401).json({ error: err.message });
            }
        });



    // Endpoint para login con Google que devuelve JWT propio
    router.post('/google', async (req, res) => {
        const { token } = req.body;

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { token: appToken, user } = await authService.loginWithGoogle({ email: payload.email });
            res.status(200).json({
                message: 'Login exitoso',
                user,
                token: appToken
            });
        } catch (error) {
            console.error('Error en google-login:', error);
            res.status(401).json({ message: 'Token de Google inválido', error: error.message });
        }
    });

    // Ruta para obtener el usuario autenticado
    router.get('/me', authenticate, async (req, res) => {
        try {
            // Opcional: puedes buscar el usuario actualizado en la base de datos usando req.user.id
            // const user = await authService.getUserById(req.user.id)
            // res.json({ user })
            res.json({ user: req.user })
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener usuario autenticado' })
        }
    });

    return router;
}

module.exports = createAuthRouter;
