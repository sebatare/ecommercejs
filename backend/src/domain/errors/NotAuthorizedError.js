class NotAuthorizedError extends Error {
    constructor() {
        super();
        this.name = "NotAuthorizedError";
        this.statusCode = 401; // Unauthorized
        this.message = "No tiene acceso a este recurso";
    }
}

module.exports = NotAuthorizedError;
