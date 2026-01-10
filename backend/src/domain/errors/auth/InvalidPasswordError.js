// Error semántico de dominio

class InvalidPasswordError extends Error {
    constructor(reason) {
        super(reason);
        this.name = 'InvalidPasswordError';
        this.reason = reason;
    }
}

module.exports = InvalidPasswordError;
