// src/infrastructure/db/PostgresProductRepository.js
const pool = require('../db/pool');
const Product = require('../../domain/Product');

class ProductRepository {
    async findAll() {
        try {
            const res = await pool.query(`
                SELECT 
                    p.id AS product_id,
                    p.name AS product_name,
                    p.description,
                    p.created_date,
                    p.price,
                    p.stock,
                    COALESCE(
                        json_agg(
                            jsonb_build_object(
                                'id', c.id,
                                'name', c.name
                            )
                        ) FILTER (WHERE c.id IS NOT NULL), '[]'
                    ) AS categories
                FROM products p
                LEFT JOIN product_categories pc ON p.id = pc.product_id
                LEFT JOIN categories c ON pc.category_id = c.id
                GROUP BY p.id
                ORDER BY p.id
            `);

            return res.rows.map(row => new Product({
                id: row.product_id,
                name: row.product_name,
                description: row.description,
                createdAt: row.created_date,
                price: row.price,
                stock: row.stock,
                categories: row.categories
            }));
        } catch (error) {
            console.error('Error en findAll:', error);
            throw new Error('No se pudieron obtener los productos');
        }
    }

    async findById(id) {
        try {
            const res = await pool.query(`
                SELECT 
                    p.id AS product_id,
                    p.name AS product_name,
                    p.description,
                    p.created_date,
                    p.price,
                    p.stock,
                    COALESCE(
                        json_agg(
                            jsonb_build_object(
                                'id', c.id,
                                'name', c.name
                            )
                        ) FILTER (WHERE c.id IS NOT NULL), '[]'
                    ) AS categories
                FROM products p
                LEFT JOIN product_categories pc ON p.id = pc.product_id
                LEFT JOIN categories c ON pc.category_id = c.id
                WHERE p.id = $1
                GROUP BY p.id
            `, [id]);

            if (res.rows.length === 0) return null;

            const row = res.rows[0];
            return new Product({
                id: row.product_id,
                name: row.product_name,
                description: row.description,
                createdAt: row.created_date,
                price: row.price,
                stock: row.stock,
                categories: row.categories
            });
        } catch (error) {
            console.error('Error en findById:', error);
            throw new Error('No se pudo obtener el producto');
        }
    }

    async create({ name, description, price, stock, categoryIds = [] }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const res = await client.query(
                `INSERT INTO products (name, description, price, stock) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [name, description, price, stock]
            );
            const product = res.rows[0];

            if (Array.isArray(categoryIds) && categoryIds.length > 0) {
                const values = categoryIds.map((catId, idx) => `($1, $${idx + 2})`).join(', ');
                await client.query(
                    `INSERT INTO product_categories (product_id, category_id) VALUES ${values}`,
                    [product.id, ...categoryIds]
                );
            }

            await client.query('COMMIT');
            const prodWithCats = await this.findById(product.id);
            return prodWithCats;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en create:', error);
            throw new Error('No se pudo crear el producto');
        } finally {
            client.release();
        }
    }
    //ACUTALIZAR METODO UPDATE PARA RECIBIR ID DE CATEGORIAS
    async update(id, data) {
        try {
            const { name, description, price, stock } = data;
            const res = await pool.query(
                `UPDATE products 
                 SET name = $1, description = $2, price = $3, stock = $4 
                 WHERE id = $5 RETURNING *`,
                [name, description, price, stock, id]
            );
            const row = res.rows[0];
            return new Product({ ...row, createdAt: row.created_date });
        } catch (error) {
            console.error('Error en update:', error);
            throw new Error('No se pudo actualizar el producto');
        }
    }

    async delete(id) {
        try {
            await pool.query('DELETE FROM products WHERE id = $1', [id]);
        } catch (error) {
            console.error('Error en delete:', error);
            throw new Error('No se pudo eliminar el producto');
        }
    }
    async deleteByQuantity(id, quantity) {
        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor que cero");
        }
        console.log(`Disminuyendo stock del producto ID: ${id} en cantidad: ${quantity}`);
        try {
            // Disminuir el stock
            const res = await pool.query(
                `UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING *`,
                [quantity, id]
            );
            if (res.rowCount === 0) {
                throw new Error("No hay suficiente stock o producto no encontrado");
            }
            // Si el stock llega a 0, puedes eliminar el producto si lo deseas:
            // await pool.query('DELETE FROM products WHERE id = $1 AND stock <= 0', [id]);
        } catch (error) {
            console.error('Error en deleteByQuantity:', error);
            throw new Error('No se pudo disminuir el stock del producto');
        }
    }
}

module.exports = ProductRepository;
