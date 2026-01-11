class InvalidPasswordError extends Error {
    constructor(message = 'Contraseña inválida') {
        super(message);
        this.name = 'InvalidPasswordError';
    }
}

module.exports = InvalidPasswordError;  // Default export, not named export