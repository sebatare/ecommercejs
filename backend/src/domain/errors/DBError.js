class DBError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Errr en la base de datos';
    }
}

module.exports = DBError;
