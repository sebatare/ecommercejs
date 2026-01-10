const request = require('supertest');
const app = require('../../main');

describe('Auth API - Integration', () => {

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `newuser${Date.now()}@test.com`,
                    password: 'Password123!'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');
        });

        it('should return 400 if email is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    password: 'Password123!'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: `user${Date.now()}@test.com`
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if email format is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'Password123!'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 409 if email already exists', async () => {
            const email = `duplicate${Date.now()}@test.com`;

            // Primer registro exitoso
            await request(app)
                .post('/api/auth/register')
                .send({ email, password: 'Password123!' });

            // Segundo registro con mismo email
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email, password: 'Password456!' });

            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/auth/login', () => {
        let testEmail;
        let testPassword = 'Password123!';

        beforeEach(async () => {
            testEmail = `user${Date.now()}@test.com`;

            // Crear usuario para los tests de login
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: testEmail,
                    password: testPassword
                });
        });

        it('should login user with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');
            expect(res.body.email).toBe(testEmail);
        });

        it('should return 400 if email is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    password: testPassword
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

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

        it('should return 401 if password is incorrect', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: 'WrongPassword123!'
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        });
    });
});
