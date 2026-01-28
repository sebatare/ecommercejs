const SECRET = process.env.JWT_SECRET;
//if (!SECRET) throw new Error('JWT_SECRET no está definido en el .env');
const Password = require('../../domain/value-objects/Password');
const jwt = require('jsonwebtoken');
const RegisteredEmailError = require('../../domain/errors/auth/RegisteredEmailError');
const { user } = require('pg/lib/defaults');

class AuthService {
    constructor(userRepository, cartRepository, refreshTokenRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    // ===============================
    // MÉTODO PRIVADO PARA CREAR TOKEN
    // ===============================
    _generateToken(userEntity) {
        const token = jwt.sign(
            { id: userEntity.id, email: userEntity.email, role: userEntity.role, name: userEntity.name },
            SECRET,
            { expiresIn: '2h' }
        );
        return token;
    }

    _generateRefreshToken(userEntity) {
        const refreshToken = jwt.sign(
            { id: userEntity.id, email: userEntity.email, role: userEntity.role, name: userEntity.name },
            SECRET,
            { expiresIn: '7d' }
        );
        return refreshToken;
    }

    /**
     * Crea un refresh token y lo almacena en la BD
     */
    async _createRefreshTokenRecord(userId) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 días de expiración

        const refreshTokenRecord = await this.refreshTokenRepository.create(userId, expiresAt);
        return refreshTokenRecord.token;
    }

    async register({ name, email, password, isAdmin = false }) {

        // 1️⃣ Validación de dominio
        const passwordVO = Password.create(password);

        // 2️⃣ Regla de negocio: email único
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new RegisteredEmailError(email);
        }
        // 3️⃣ Preparar datos de persistencia
        const roleId = isAdmin ? 2 : 1;
        const role = isAdmin ? 'admin' : 'cliente';

        const hashedPassword = await Password.hash(passwordVO.value);

        // 4️⃣ Crear usuario (ENTITY)
        const userEntity = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            roleId,
            //imageUrl: null,
            createdAt: new Date(),
        });

        const cartEntity = await this.cartRepository.createCart(userEntity.id);

        // 5️⃣ Crear refresh token en BD
        const refreshToken = await this._createRefreshTokenRecord(userEntity.id);

        const userDto = {
            id: userEntity.id,
            name: userEntity.name,
            email: userEntity.email,
            createdAt: new Date(),
            role: role,
            cart: {
                id: cartEntity.id,
                items: []
            }
        };

        const token = this._generateToken(userDto);
        return {
            user: userDto,
            token,
            refreshToken
        };
    }

    async login({ email, password }) {

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas');

        const valid = await Password.compare(password, user.password);
        if (!valid) throw new Error('Credenciales inválidas');

        const userDto = {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
                ? new Date(user.createdAt).toLocaleString('es-CL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
                : null,
            roleId: user.roleId,
            role: user.role,
            imageUrl: user.image_url ?? null
        }

        const token = this._generateToken(user);
        // Crear refresh token en BD
        const refreshToken = await this._createRefreshTokenRecord(user.id);

        return {
            token,
            refreshToken,
            user: userDto
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
        // Crear refresh token en BD
        const refreshToken = await this._createRefreshTokenRecord(user.id);

        return { token, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }

    /**
     * Valida y refresca el JWT usando un refresh token
     */
    async refreshAccessToken(userId, refreshToken) {
        // Validar que el refresh token sea válido
        const isValid = await this.refreshTokenRepository.validateToken(userId, refreshToken);

        if (!isValid) {
            throw new Error('Refresh token inválido o expirado');
        }

        // Obtener usuario
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Generar nuevo access token
        const newAccessToken = this._generateToken(user);

        return {
            token: newAccessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    /**
     * Revoca todos los refresh tokens de un usuario (logout desde todos los dispositivos)
     */
    async logoutAllDevices(userId) {
        await this.refreshTokenRepository.revokeAllForUser(userId);
    }
}
module.exports = AuthService;