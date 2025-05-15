class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    getAll() {
        return this.repository.findAll();
    }

    getById(id) {
        return this.repository.findById(id);
    }

    delete(id) {
        return this.repository.delete(id);
    }
}

module.exports = BaseService;
