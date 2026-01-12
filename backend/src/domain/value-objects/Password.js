// domain/value-objects/Password.js
const bcrypt = require('bcryptjs');
const InvalidPasswordError = require('../errors/auth/InvalidPasswordError');

class Password {
    static create(password) {
        if (!password || password.length < 6) {
            throw new InvalidPasswordError(
                'PASSWORD_TOO_SHORT',
                'La contraseña debe tener al menos 6 caracteres'
            );
        }

        if (!/\d/.test(password)) {
            throw new InvalidPasswordError(
                'PASSWORD_NO_NUMBER',
                'La contraseña debe contener al menos un número'
            );
        }

        if (!/[A-Z]/.test(password)) {
            throw new InvalidPasswordError(
                'PASSWORD_NO_UPPERCASE',
                'La contraseña debe contener una letra mayúscula'
            );
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new InvalidPasswordError(
                'PASSWORD_NO_SPECIAL_CHAR',
                'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)'
            );
        }
        return new Password(password);
    }

    constructor(value) {
        this.value = value;
    }

    static async hash(password) {
        return bcrypt.hash(password, 10);
    }
    static async compare(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Password;
