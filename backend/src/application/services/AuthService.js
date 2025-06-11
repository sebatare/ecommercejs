const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register({ name, email, password }) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new Error('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({ name, email, password: hashedPassword, roleId: 2 }); // Asignar rol por defecto
        return user;
    }

    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Credenciales inválidas');
        }

        // Crear y firmar el token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET,
            { expiresIn: '2h' }
        );

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}

module.exports = AuthService;
