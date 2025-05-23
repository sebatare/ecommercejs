const pool = require('../db/pool');
const User = require('./../../domain/User');
const BaseRepository = require('./BaseRepository');
class UserRepository extends BaseRepository {
    constructor() {
        super('users', row => new User(row));
    }
    async findByEmail(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0] ? new User(res.rows[0]) : null;
    }

    async create({ name, email, password }) {
        const res = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );
        return new User(res.rows[0]);
    }

    async findAll() {
        return await super.findAll();
    }
}

module.exports = UserRepository;
