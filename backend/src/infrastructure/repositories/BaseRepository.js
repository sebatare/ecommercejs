const pool = require('../db/pool');

class BaseRepository {
    constructor(tableName, mapper) {
        this.tableName = tableName;
        this.mapper = mapper;
    }

    async findAll() {
        const res = await pool.query(`SELECT * FROM ${this.tableName} ORDER BY id`);
        return res.rows.map(this.mapper);
    }

    async findById(id) {
        const res = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
        return res.rows.length ? this.mapper(res.rows[0]) : null;
    }

    async delete(id) {
        await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    }

    async update(id, data) {
        const columns = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(data);
        const query = `UPDATE ${this.tableName} SET ${columns} WHERE id = $1 RETURNING *`;

        const res = await pool.query(query, [id, ...values]);
        
        return res.rows[0] ? this.mapper(res.rows[0]) : null;
    }
}

module.exports = BaseRepository;
