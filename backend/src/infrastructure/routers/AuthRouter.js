const express = require('express');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library')
const authenticate = require('../../middleware/authenticate')
const RegisteredEmailError = require('../../domain/errors/auth/RegisteredEmailError');
const InvalidPasswordError = require('../../domain/errors/auth/InvalidPasswordError');


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
                const { user, token } = await authService.register(req.body);

                res.cookie('auth', token, {
                    httpOnly: true,                 // clave
                    secure: process.env.NODE_ENV === 'productionHTTPS',
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 * 24,
                    path: '/'
                });

                return res.status(201).json({
                    user
                });
            } catch (err) {
                if (err instanceof InvalidPasswordError) {
                    return res.status(400).json({
                        code: err.code,
                        message: err.message
                    });
                }

                if (err instanceof RegisteredEmailError) {
                    return res.status(409).json({
                        code: 'EMAIL_ALREADY_EXISTS',
                        message: `El email ${err.email} ya está registrado`
                    });
                }

                return res.status(500).json({
                    code: 'INTERNAL_ERROR',
                    message: err.message
                });
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


                res.cookie('auth', token, {
                    httpOnly: true,        // ✅ Previene acceso desde JavaScript
                    secure: process.env.NODE_ENV === 'productionHTTPS', // ✅ Solo HTTPS en prod
                    sameSite: 'lax',    // ⚠️ Cambiar a 'lax' o 'none'
                    maxAge: 1000 * 60 * 60 * 24, // ✅ 24 horas
                    path: '/'              // ✅ Añadir esto
                });

                res.json({
                    user
                });

            } catch (err) {
                return res.status(401).json({ error: err.message });
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
            return res.status(401).json({ message: 'Token de Google inválido', error: error.message });
        }
    });

    // Ruta para obtener el usuario autenticado
    router.get('/me', authenticate, (req, res) => {
        res.json({ user: req.user });
    });



    router.post('/logout', (req, res) => {
        res.clearCookie('auth', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'productionHTTPS',
            sameSite: 'lax',
            path: '/'
        });
        return res.status(200).json({ message: 'Logout exitoso' });
    });

    return router;
}

module.exports = createAuthRouter;
