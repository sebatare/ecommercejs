class CartValidationError extends Error {
    constructor(message, field = null) {
        super(message);
        this.name = 'CartValidationError';
        this.field = field;
    }
}

module.exports = CartValidationError;
