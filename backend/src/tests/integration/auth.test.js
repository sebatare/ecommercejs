const request = require('supertest');
const app = require('../../main');
const { describe } = require('node:test');
/*
Tests:
    - Registro de usuario exitoso
    - Registro de usuario fallido - email duplicado
    - Registro de usuario fallido - datos inválidos
    
    - Login de usuario
    - Refresh token
*/
describe('Auth API - Integration Tests', () => {

    // Registro Exitoso
    // Registro Fallido - email duplicado

    // Registro Fallido - datos inválidos

    describe('POST /api/auth/register', () => {

        // Test relevante: registro exitoso
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'New User',
                    email: `newuser${Date.now()}@test.com`,
                    password: 'Oasis123!'
                });
            // Debe devolver token y datos del usuario

            expect(res.status).toBe(201);

            // Usuario OK
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user).toHaveProperty('email');

            // Cookie seteada
            expect(res.headers['set-cookie']).toBeDefined();
            expect(
                res.headers['set-cookie'].some(c => c.startsWith('auth='))
            ).toBe(true);

            // Refresh token cookie seteada
            expect(
                res.headers['set-cookie'].some(c => c.startsWith('refreshToken='))
            ).toBe(true);

        });

        // Test relevante: email duplicado
        it('should return 409 if email already exists', async () => {
            const email = `duplicate${Date.now()}@test.com`;

            // Primer registro exitoso
            await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email, password: 'Password123!' });

            // Segundo registro con mismo email
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test2', email, password: 'Password456!' });

            // Debe devolver conflicto
            expect(res.status).toBe(409);
            expect(res.body).toEqual(
                expect.objectContaining({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: expect.any(String),
                })
            );

        });
    });

    // ============================
    // LOGIN Y LOGOUT DE USUARIO
    // ============================
    describe('POST /api/auth/login', () => {
        let testEmail;
        const testPassword = 'Password123!';

        beforeEach(async () => {
            testEmail = `user${Date.now()}@test.com`;

            // Crear usuario real en DB antes de cada test de login
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Login User',
                    email: testEmail,
                    password: testPassword
                });
        });

        // Login exitoso
        it('should login user with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword
                })

            // Debe devolver token válido y datos del usuario
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user.email', testEmail);
            expect(res.body).toHaveProperty('user.name');
            expect(res.body.user.email).toBe(testEmail);

            // Cookie presente
            expect(res.headers['set-cookie']).toBeDefined();
            expect(
                res.headers['set-cookie'].some(c => c.startsWith('auth='))
            ).toBe(true);

            // Refresh token cookie presente
            expect(
                res.headers['set-cookie'].some(c => c.startsWith('refreshToken='))
            ).toBe(true);
        });

        // Login con contraseña incorrecta
        it('should return 401 if password is incorrect', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: 'WrongPassword123!'
                });

            // Debe devolver status de no autorizado
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });

        // Login con usuario inexistente
        it('should return 401 if user does not exist', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: testPassword
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });


        //Debe devolver el usuario autenticado usando la cookie
        it('should return authenticated user using cookie', async () => {
            const agent = request.agent(app);

            // Login (guarda cookie automáticamente)
            await agent.post('/api/auth/login').send({
                email: testEmail,
                password: testPassword
            });

            // Acceso protegido
            const res = await agent.get('/api/auth/me');

            expect(res.status).toBe(200);
            expect(res.body.user.email).toBe(testEmail);
        });

    });

    describe('POST /api/auth/logout', () => {

        it('should logout user and clear auth cookie', async () => {
            const agent = request.agent(app);

            // Login primero
            await agent.post('/api/auth/login').send({
                email: `logoutuser${Date.now()}@test.com`,
                password: 'Password123!'
            });

            // Logout
            const res = await agent.post('/api/auth/logout');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logout exitoso');

            // Verificar que la cookie 'auth' fue borrada
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(
                cookies.some(c => c.startsWith('auth=;'))
            ).toBe(true);

            // Verificar que la cookie 'refreshToken' fue borrada
            expect(
                cookies.some(c => c.startsWith('refreshToken=;'))
            ).toBe(true);
        });
    });

    // ============================
    // REFRESH TOKEN TESTS
    // ============================
    describe('POST /api/auth/refresh', () => {

        it('should refresh access token with valid refresh token', async () => {
            const agent = request.agent(app);
            const testEmail = `refreshuser${Date.now()}@test.com`;

            // Primero registrar el usuario
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Refresh User',
                    email: testEmail,
                    password: 'Password123!'
                });

            if (registerRes.status !== 201) {
                console.error('Register failed:', registerRes.status, registerRes.body);
                return;
            }

            // Usar el agent para mantener las cookies
            const loginRes = await agent
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: 'Password123!'
                });

            expect(loginRes.status).toBe(200);

            // Esperar un bit para que sea diferente
            await new Promise(resolve => setTimeout(resolve, 100));

            // Refrescar token
            const refreshRes = await agent
                .post('/api/auth/refresh');

            expect(refreshRes.status).toBe(200);
            expect(refreshRes.body).toHaveProperty('user.email', testEmail);
            expect(refreshRes.body).toHaveProperty('message', 'Token refrescado exitosamente');

            // Verificar que la cookie de auth fue actualizada
            const newAuthCookie = refreshRes.headers['set-cookie']?.find(c => c.startsWith('auth='));
            expect(newAuthCookie).toBeDefined();
        });

        it('should return 401 if refresh token is missing', async () => {
            const res = await request(app)
                .post('/api/auth/refresh');

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'Refresh token no encontrado');
        });

        it('should return 401 if refresh token is invalid', async () => {
            const agent = request.agent(app);

            // Configurar una cookie de refresh token inválida
            agent.set('Cookie', 'refreshToken=invalid.token.here');

            const res = await agent
                .post('/api/auth/refresh');

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });

        it('should allow user to continue accessing protected routes after refresh', async () => {
            const agent = request.agent(app);
            const testEmail = `protecteduser${Date.now()}@test.com`;

            // Primero registrar el usuario
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Protected User',
                    email: testEmail,
                    password: 'Password123!'
                });

            // Login
            const loginRes = await agent
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: 'Password123!'
                });

            expect(loginRes.status).toBe(200);

            // Acceder a ruta protegida
            let meRes = await agent.get('/api/auth/me');
            expect(meRes.status).toBe(200);
            expect(meRes.body.user.email).toBe(testEmail);

            // Refrescar token
            const refreshRes = await agent
                .post('/api/auth/refresh');

            expect(refreshRes.status).toBe(200);

            // Acceder a ruta protegida nuevamente (con nuevo token)
            meRes = await agent.get('/api/auth/me');
            expect(meRes.status).toBe(200);
            expect(meRes.body.user.email).toBe(testEmail);
        });
    });
});
