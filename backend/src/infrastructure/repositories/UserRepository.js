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
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // 1. Crear el usuario
            const resUser = await client.query(
                `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                [name, email, password, roleId]
            );
            const user = resUser.rows[0];

            // 2. Crear el carrito asociado al usuario
            await client.query(
                `INSERT INTO carts (user_id) VALUES ($1)`,
                [user.id]
            );

            await client.query('COMMIT');
            return new User(user);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async findAll() {
        return await super.findAll();
    }

    async setRole({ userEmail, roleId }) {
        const res = await pool.query(
            `UPDATE users SET role_id = $1 WHERE email = $2 RETURNING *`,
            [roleId, userEmail]
        );
        return new User(res.rows[0]);
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
