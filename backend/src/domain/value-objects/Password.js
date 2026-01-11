// domain/value-objects/Password.js
const bcrypt = require('bcryptjs');
const InvalidPasswordError = require('../errors/auth/InvalidPasswordError');

class Password {
    constructor(value, isHashed = false) {
        this._value = value;
        this._isHashed = isHashed;
        Object.freeze(this);
    }

    // Factory para crear desde contraseña plana (con validación)
    static create(plainPassword) {
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
        
        return new Password(plainPassword, false);
    }

    // Factory para crear desde hash (sin validación)
    static fromHash(hashedPassword) {
        return new Password(hashedPassword, true);
    }

    // Hashear la contraseña plana
    async hash() {
        if (this._isHashed) {
            throw new Error('Password is already hashed');
        }
        return bcrypt.hash(this._value, 10);
    }

    // Comparar contraseña plana con este hash
    async matches(plainPassword) {
        if (!this._isHashed) {
            throw new Error('Cannot compare against non-hashed password');
        }
        return await bcrypt.compare(plainPassword, this._value);
    }

    // Getter para obtener el valor (útil si necesitas el hash)
    get value() {
        return this._value;
    }
}

module.exports = Password;
