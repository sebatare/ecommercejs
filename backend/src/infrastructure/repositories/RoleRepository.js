const pool = require('../db/pool');
const BaseRepository = require('./BaseRepository');
const Role = require('../../domain/Role');

class RoleRepository extends BaseRepository {
    constructor() {
        super('roles', row => new Role(row));
    }

    async create(data) {
        const res = await pool.query(
            `INSERT INTO roles (name) VALUES ($1) RETURNING *`,
            [data.name]
        );
        return this.mapper(res.rows[0]);
    }

    async update(id, data) {
        const res = await pool.query(
            `UPDATE roles SET name = $1 WHERE id = $2 RETURNING *`,
            [data.name, id]
        );
        return this.mapper(res.rows[0]);
    }

    async delete(id) {
        await pool.query(
            `DELETE FROM roles WHERE id = $1`,
            [id]
        );
    }
}

module.exports = RoleRepository;
