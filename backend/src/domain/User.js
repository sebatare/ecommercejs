
class User {
    constructor({ id, name, email, password, created_at, role_id, role_name }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        // Soporta ambos nombres de campo
        this.createdAt = created_at;
        this.roleId = role_id;
        this.role = role_name;
    }
}

module.exports = User;
