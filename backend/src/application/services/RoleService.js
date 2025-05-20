const BaseService = require('./BaseService');

class RoleService extends BaseService {
    constructor(roleRepository) {
        super(roleRepository);
    }

    create(data) {
       
        return this.repository.create(data);
    }

    update(id, data) {
        return this.repository.update(id, data);
    }
}

module.exports = RoleService;
//cambiaso