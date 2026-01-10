const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Password = require('../../domain/value-objects/Password');

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';


class AuthService {
    constructor(userRepository, cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    async register({ name, email, password, isAdmin = false }) {
        //Creacion del Value Object Password con su logica de negocio
        // Si es inválida, lanza error de dominio automáticamente
        const passwordVO = Password.create(password);

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        const roleId = isAdmin ? 2 : 1; // Asignar rol según isAdmin
        const hashedPassword = await passwordVO.hash(password, 10);
        const user = await this.userRepository.create({ name, email, password: hashedPassword, roleId: roleId }); // Asignar rol por defecto
        // Crear el carrito asociado al usuario
        const cart = await this.cartRepository.createCart(user.id);
        return { ...user, cart };
    }

    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const passwordVO = Password.create(password);
        const valid = await passwordVO.matches(user.password);
        if (!valid) {
            throw new Error('Credenciales inválidas');
        }

        // Crear y firmar el token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            SECRET,
            { expiresIn: '2h' }
        );

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }

    async loginWithGoogle({ email }) {
        let user = await this.userRepository.findByEmail(email);
        if (!user) {
            // Si no existe, crear usuario (puedes ajustar el rol y otros campos según tu lógica)
            user = await this.userRepository.create({
                email,
                name: '',
                password: null, // No hay password para Google
                imageUrl: '',
                roleId: 1 // Rol por defecto
            });
            // Crear el carrito asociado al usuario
            await this.cartRepository.createCart(user.id);
        }
        // Generar JWT propio
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            SECRET,
            { expiresIn: '2h' }
        );
        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}



module.exports = AuthService;
