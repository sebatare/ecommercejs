const pool = require('../db/pool');
const User = require('./../../domain/User');
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super('users', row => new User(row));
    }

    async findByEmail(email) {
        const res = await pool.query(
            `SELECT u.*, r.name AS role_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.email = $1`,
            [email]
        );

        return res.rows[0] ? new User(res.rows[0]) : null;
    }

    async create({ name, email, password, roleId }) {
        const resUser = await pool.query(
            `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, password, roleId]
        );
        const user = resUser.rows[0];
        return new User(user);
    }

    async findAll() {
        return await super.findAll();
    }

    // Este método es mucho más simple ahora.
    async update(id, updatedData) {
        return await super.update(id, updatedData);
    }

    async deleteByEmail(email) {
        const res = await pool.query(
            `DELETE FROM users WHERE email = $1 RETURNING *`,
            [email]
        );
        return res.rows[0] ? new User(res.rows[0]) : null;
    }
}

module.exports = UserRepository;