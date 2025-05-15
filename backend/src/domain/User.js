class User {
    constructor({ id, name, email, password, created_date }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = created_date;
    }
}

module.exports = User;
