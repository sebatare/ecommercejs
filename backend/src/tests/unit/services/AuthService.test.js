const AuthService = require('../../../application/services/AuthService');
const jwt = require('jsonwebtoken');

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

const bcrypt = require('bcryptjs');

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
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = { name: 'Test User', email: 'test@test.com', password: 'Oasis123!' };
            const hashedPassword = 'hashed-password';
            const newUser = { id: 1, name: 'Test User', email: 'test@test.com', roleId: 1, cart: { id: 1, userId: 1 } };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            mockUserRepository.create.mockResolvedValue(newUser);
            mockCartRepository.createCart.mockResolvedValue({ id: 1, userId: 1 });

            const result = await authService.register(userData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                roleId: 1,
            });
            expect(mockCartRepository.createCart).toHaveBeenCalledWith(newUser.id);
            expect(result).toEqual(newUser);
        });

        it('should throw error if email already exists', async () => {
            const userData = { name: 'Test', email: 'existing@test.com', password: 'Oasis123!' };
            const existingUser = { id: 1, email: 'existing@test.com' };

            mockUserRepository.findByEmail.mockResolvedValue(existingUser);

            await expect(authService.register(userData)).rejects.toThrow('El email ya está registrado');
            expect(mockUserRepository.create).not.toHaveBeenCalled();
            expect(mockCartRepository.createCart).not.toHaveBeenCalled();
        });
    });

    // -----------------------------
    // LOGIN UNIT TESTS
    // -----------------------------
    describe('login', () => {
        it('should login user with correct credentials', async () => {
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

        it('should throw error if user does not exist', async () => {
            const credentials = { email: 'nonexistent@test.com', password: 'pass123' };

            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas');
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('should throw error if password is incorrect', async () => {
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
    describe('loginWithGoogle', () => {
        it('should login existing Google user', async () => {
            const email = 'user@gmail.com';
            const user = { id: 1, name: 'Google User', email, password: null};

            mockUserRepository.findByEmail.mockResolvedValue(user);

            const result = await authService.loginWithGoogle({ email });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepository.create).not.toHaveBeenCalled();
            expect(result).toHaveProperty('token');
            expect(result.user.email).toBe(email);
        });

        it('should create new user if Google user does not exist', async () => {
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

        it('should assign default role (1) to new Google user', async () => {
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
