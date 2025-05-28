class DBError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Error en la base de datos';
    }
}

module.exports = DBError;
