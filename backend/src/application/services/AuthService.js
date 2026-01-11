const SECRET = process.env.JWT_SECRET
const Password = require('../../domain/value-objects/Password');
const jwt = require('jsonwebtoken');
const RegisteredEmailError = require('../../domain/errors/auth/RegisteredEmailError');
class AuthService {
    constructor(userRepository, cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    // ===============================
    // MÉTODO PRIVADO PARA CREAR TOKEN
    // ===============================
    _generateToken(user) {
        const role = user.role || (user.roleId === 2 ? 'admin' : 'cliente');
        const token = jwt.sign(
            { id: user.id, email: user.email, role, name: user.name },
            SECRET,
            { expiresIn: '2h' }
        );
        return token;
    }

    async register({ name, email, password, isAdmin = false }) {
        // 1. Validar contraseña (esto lanza InvalidPasswordError si es inválida)
        const passwordVO = Password.create(password);

        // 2. Verificar email duplicado
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new RegisteredEmailError(email);
        }

        // 3. Hashear y crear usuario
        const roleId = isAdmin ? 2 : 1;
        const hashedPassword = await passwordVO.hash();  // ✅ Sin parámetros

        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            roleId
        });

        user.role = isAdmin ? 'admin' : 'cliente';
        const cart = await this.cartRepository.createCart(user.id);
        const token = this._generateToken(user);
        return { ...user, cart, token };
    }

    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas');

        // Crear VO desde el hash almacenado (sin validación)
        const hashedPasswordVO = Password.fromHash(user.password);
        const valid = await hashedPasswordVO.matches(password);

        if (!valid) throw new Error('Credenciales inválidas');

        const token = this._generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async loginWithGoogle({ email }) {
        let user = await this.userRepository.findByEmail(email);
        if (!user) {
            user = await this.userRepository.create({
                email,
                name: '',
                password: null,
                imageUrl: '',
                roleId: 1
            });
            await this.cartRepository.createCart(user.id);
        }

        // Generamos token con el mismo método
        const token = this._generateToken(user);

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}
module.exports = AuthService;