const Category = require('../../domain/Category');
const BaseRepository = require('./BaseRepository');//findAll, findById, delete

class CategoryRepository extends BaseRepository {
    constructor() {
        super('categories', row => new Category(row.id, row.name));
    }

    async create(data) {
        const res = await this.pool.query(
            `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
            [data.name]
        );
        return this.mapper(res.rows[0]);
    }

    async update(id, data) {
        const res = await this.pool.query(
            `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`,
            [data.name, id]
        );
        return this.mapper(res.rows[0]);
    }
}

module.exports = CategoryRepository;