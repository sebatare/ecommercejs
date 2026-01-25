const request = require('supertest');
const app = require('../../main');
const { describe } = require('node:test');
/*
Tests:
    - Registro de usuario exitoso
    - Registro de usuario fallido - email duplicado
    - Registro de usuario fallido - datos inválidos
    
    - Login de usuario


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
        });
    });
});
