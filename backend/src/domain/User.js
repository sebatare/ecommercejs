
class User {
    constructor({ id, name, email, password, createdAt, roleId, roleName }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        // Soporta ambos nombres de campo
        this.createdAt = createdAt;
        this.roleId = roleId;
        this.role = roleName;
    }
}

module.exports = User;
