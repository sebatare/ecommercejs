const DBError = require('./DBError');

class UniqueConstraintError extends DBError {
    constructor(message) {
        super(message);
        this.name = 'UniqueConstraintError';
    }
}

module.exports = UniqueConstraintError;
