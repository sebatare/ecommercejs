// domain/value-objects/Password.js
// Value Object de dominio: representa una contraseña válida del sistema

const bcrypt = require('bcryptjs');
const InvalidPasswordError = require('../errors/auth/InvalidPasswordError');

class Password {
    // El constructor es privado por convención:
    // se fuerza el uso del factory `create`
    constructor(plainPassword) {
        this._value = plainPassword;

        // Inmutabilidad: evita modificaciones posteriores
        Object.freeze(this);
    }

    // Factory method: único punto de creación
    static create(plainPassword) {
        // Validación de invariantes de dominio
        if (!plainPassword || typeof plainPassword !== 'string') {
            throw new InvalidPasswordError('PASSWORD_EMPTY');
        }

        if (plainPassword.length < 8) {
            throw new InvalidPasswordError('PASSWORD_TOO_SHORT');
        }

        if (!/[A-Z]/.test(plainPassword)) {
            throw new InvalidPasswordError('PASSWORD_NO_UPPERCASE');
        }

        if (!/[a-z]/.test(plainPassword)) {
            throw new InvalidPasswordError('PASSWORD_NO_LOWERCASE');
        }

        if (!/[0-9]/.test(plainPassword)) {
            throw new InvalidPasswordError('PASSWORD_NO_NUMBER');
        }

        if (!/[^A-Za-z0-9]/.test(plainPassword)) {
            throw new InvalidPasswordError('PASSWORD_NO_SPECIAL_CHAR');
        }

        // Si pasa todas las reglas, se crea el Value Object
        return new Password(plainPassword);
    }

    // Operación válida del dominio: obtener hash
    async hash() {
        // El valor plano nunca se expone fuera del VO
        return bcrypt.hash(this._value, 10);
    }

    // Comparación segura contra un hash existente
    async matches(hash) {
        return bcrypt.compare(this._value, hash);
    }
}

module.exports = Password;
