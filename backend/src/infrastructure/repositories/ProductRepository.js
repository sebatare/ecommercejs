// src/infrastructure/db/PostgresProductRepository.js
const pool = require('../db/pool');
const Product = require('../../domain/Product');

class ProductRepository {
    async findAll() {
        const res = await pool.query('SELECT * FROM products ORDER BY id');
        return res.rows.map(row => new Product({ ...row, createdAt: row.created_date }));
    }

    async findById(id) {
        const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        const row = res.rows[0];
        return row ? new Product({ ...row, createdAt: row.created_date }) : null;
    }

    async create({ name, description, price, stock }) {
        const res = await pool.query(
            `INSERT INTO products (name, description, price, stock) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, description, price, stock]
        );
        const row = res.rows[0];
        return new Product({ ...row, createdAt: row.created_date });
    }

    async update(id, data) {
        const { name, description, price, stock } = data;
        const res = await pool.query(
            `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4 
       WHERE id = $5 RETURNING *`,
            [name, description, price, stock, id]
        );
        const row = res.rows[0];
        return new Product({ ...row, createdAt: row.created_date });
    }

    async delete(id) {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
    }
}

module.exports = ProductRepository;
