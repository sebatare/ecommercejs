const request = require('supertest');
const app = require('../../main');
const { describe } = require('node:test');
/*
Tests:
    - Obtener lista de usuarios exitosamente
    - Obtener lista de usuarios fallido - sin autenticación
    - Obtener detalles de usuario exitosamente
    - Obtener detalles de usuario fallido - usuario no encontrado
    - Actualizar usuario exitosamente
    - Actualizar usuario fallido - sin autenticación

*/
describe('User API - Integration Tests', () => {

    // Obtener lista de usuarios exitosamente
    // Obtener lista de usuarios fallido - sin autenticación

    describe('GET /api/users', () => {

        // Obtener lista de usuarios exitosamente solo como admin

        it('should get the list of users successfully as admin', async () => {
            // Primero, registramos un usuario para autenticarnos
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'List User',
                    email: `listuser${Date.now()}@test.com`,
                    password: 'Oasis123!',
                    isAdmin: true // Asegurándonos de que el usuario sea admin
                });


            const cookie = registerRes.headers['set-cookie'];

            // Luego, obtenemos la lista de usuarios
            const res = await request(app)
                .get('/api/users')
                .set('Cookie', cookie);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        // Obtener lista de usuarios fallido - sin autenticación
        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .get('/api/users');

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'No autenticado'); // Ajusta el mensaje de error según lo que devuelva tu middleware
        });

    });

    // Obtener detalles de usuario exitosamente
    // Obtener detalles de usuario fallido - usuario no encontrado

    describe('GET /api/users/:id', () => {

        // Obtener detalles de usuario exitosamente
        it('should get user details successfully', async () => {
            // Primero, registramos un usuario para autenticarnos
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Detail User',
                    email: `detailuser${Date.now()}@test.com`,
                    password: 'Oasis123!',
                    isAdmin: true
                });

            const cookie = registerRes.headers['set-cookie'];
            const userId = registerRes.body.user.id;

            // Luego, obtenemos los detalles del usuario
            const res = await request(app)
                .get(`/api/users/${userId}`)
                .set('Cookie', cookie);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', userId);
        });

        // Obtener detalles de usuario fallido - usuario no encontrado
        it('should return 404 if user not found', async () => {
            // Primero, registramos un usuario para autenticarnos
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Nonexistent User',
                    email: `nonexistent${Date.now()}@test.com`,
                    password: 'Oasis123!'
                });

            const cookie = registerRes.headers['set-cookie'];

            // Luego, intentamos obtener detalles de un usuario inexistente
            const res = await request(app)
                .get('/api/users/999999') // Asumiendo que este ID no existe
                .set('Cookie', cookie);

            expect(res.status).toBe(404);
        });

    });

    // Actualizar usuario exitosamente
    // Actualizar usuario fallido - sin autenticación
    describe('PUT /api/users/:id', () => {

        // Actualizar usuario exitosamente
        it('should update user successfully', async () => {
            // Primero, registramos un usuario para autenticarnos
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Update User',
                    email: `updateuser${Date.now()}@test.com`,
                    password: 'Oasis123!',
                    isAdmin: true
                });

            const cookie = registerRes.headers['set-cookie'];
            const userId = registerRes.body.user.id;

            // Luego, actualizamos el usuario
            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set('Cookie', cookie)
                .send({
                    name: 'Updated Name'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Updated Name');
        });

        // Actualizar usuario fallido - sin autenticación
        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .put('/api/users/1') // Intentando actualizar el usuario con ID 1
                .send({
                    name: 'Should Not Update'
                });

            expect(res.status).toBe(401);
        });

    });

});
