const SECRET = process.env.JWT_SECRET;
//if (!SECRET) throw new Error('JWT_SECRET no está definido en el .env');
const Password = require('../../domain/value-objects/Password');
const jwt = require('jsonwebtoken');
const RegisteredEmailError = require('../../domain/errors/auth/RegisteredEmailError');
const { user } = require('pg/lib/defaults');
class AuthService {
    constructor(userRepository, cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
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
            token
        };
    }

    async login({ email, password }) {

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas');

        const valid = await Password.compare(password, user.password);
        if (!valid) throw new Error('Credenciales inválidas');

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

        return {
            token,
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

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}
module.exports = AuthService;