const AuthService = require('../../../application/services/AuthService');

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

const bcrypt = require('bcryptjs');
const { create } = require('../../../domain/value-objects/Password');

describe('AuthService - Unit Tests', () => {
    let authService;
    let mockUserRepository;
    let mockCartRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocks de repositorios
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
        };

        mockCartRepository = {
            createCart: jest.fn(),
        };

        authService = new AuthService(mockUserRepository, mockCartRepository);
    });

    // -----------------------------
    // REGISTER UNIT TESTS
    // -----------------------------
    describe('Register', () => {
    it('Should register a new user successfully', async () => {
        const userData = { 
            name: 'Test User', 
            email: 'test@test.com', 
            password: 'Oasis123!' 
        };
        
        const hashedPassword = 'hashed-password';
        
        // Mock: usuario creado por el repositorio (sin cart ni role)
        const createdUser = {
            id: 1,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            roleId: 1
        };
        
        // Mock: carrito creado
        const createdCart = {
            id: 1,
            userId: 1,
            items: []  // ✅ Agregado
        };

        // Configurar mocks
        mockUserRepository.findByEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue(hashedPassword);
        mockUserRepository.create.mockResolvedValue(createdUser);
        mockCartRepository.createCart.mockResolvedValue(createdCart);

        // Ejecutar
        const result = await authService.register(userData);

        // Verificaciones de llamadas
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
        expect(mockUserRepository.create).toHaveBeenCalledWith({
            createdAt: expect.any(Date),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            roleId: 1,
        });
        expect(mockCartRepository.createCart).toHaveBeenCalledWith(createdUser.id);

        // Verificación del resultado
        expect(result).toMatchObject({
            user: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                roleId: createdUser.roleId,
                cart: {
                    id: createdCart.id,
                    items: []
                }
            },
            token: expect.any(String),
        });

        // Verificar que el token es válido JWT
        expect(result.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });
});

    // -----------------------------
    // LOGIN UNIT TESTS
    // -----------------------------
    describe('Login', () => {
        it('Should login user with correct credentials', async () => {
            const credentials = { email: 'test@test.com', password: 'Oasis123!' };
            const user = { id: 1, name: 'Test', email: 'test@test.com', password: 'hashed', role: 1 };

            mockUserRepository.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);

            const result = await authService.login(credentials);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, user.password);
            expect(result).toHaveProperty('token');
            expect(result.user).toEqual({ id: 1, name: 'Test', email: 'test@test.com', role: 1 });
        });

        it('Should throw error if user does not exist', async () => {
            const credentials = { email: 'nonexistent@test.com', password: 'Password123!' };

            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas');
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('Should throw error if password is incorrect', async () => {
            const credentials = { email: 'test@test.com', password: 'WrongPass123!' };
            const user = { id: 1, email: 'test@test.com', password: 'hashed', role: 1 };

            mockUserRepository.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas');
        });
    });

    // -----------------------------
    // LOGIN WITH GOOGLE UNIT TESTS
    // -----------------------------
    describe('Login With Google', () => {
        it('should login existing Google user', async () => {
            const email = 'user@gmail.com';
            const user = { id: 1, name: 'Google User', email, password: null };

            mockUserRepository.findByEmail.mockResolvedValue(user);

            const result = await authService.loginWithGoogle({ email });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepository.create).not.toHaveBeenCalled();
            expect(result).toHaveProperty('token');
            expect(result.user.email).toBe(email);
        });

        it('Should create new user if Google user does not exist', async () => {
            const email = 'newuser@gmail.com';
            const newUser = { id: 2, name: '', email, password: null, role: 1 };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(newUser);
            mockCartRepository.createCart.mockResolvedValue({});

            await authService.loginWithGoogle({ email });

            expect(mockUserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email,
                    password: null,
                    roleId: 1
                })
            );
            expect(mockCartRepository.createCart).toHaveBeenCalledWith(newUser.id);
        });

        it('Should assign default role (1) to new Google user', async () => {
            const email = 'newgoogle@gmail.com';
            const newUser = { id: 3, email, role: 1 };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(newUser);
            mockCartRepository.createCart.mockResolvedValue({});

            await authService.loginWithGoogle({ email });

            expect(mockUserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ roleId: 1 })
            );
        });
    });
});
