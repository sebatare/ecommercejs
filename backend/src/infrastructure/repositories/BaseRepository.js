class BaseRepository {
    constructor(tableName, mapper) {
        this.tableName = tableName;
        this.mapper = mapper;
        this.pool = require('../db/pool');
    }

    async findAll() {
        const res = await this.pool.query(`SELECT * FROM ${this.tableName} ORDER BY id`);
        return res.rows.map(this.mapper);
    }

    async findById(id) {
        const res = await this.pool.query(
            `SELECT * FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
        return res.rows.length ? this.mapper(res.rows[0]) : null;
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    }
}

module.exports = BaseRepository;
