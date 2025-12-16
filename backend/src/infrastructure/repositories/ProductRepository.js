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
                    p.created_at,
                    p.price,
                    p.stock,
                    p.discount_percentage,
                    p.image_url,
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
                categories: row.categories,
                discount_percentage: row.discount_percentage,
                imageUrl: row.image_url
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
                    p.created_at,
                    p.price,
                    p.stock,
                    p.discount_percentage,
                    p, image_url,
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
                discount_percentage: row.discount_percentage,
                imageUrl: row.image_url,
                categories: row.categories
            });
        } catch (error) {
            console.error('Error en findById:', error);
            throw new Error('No se pudo obtener el producto');
        }
    }

    async create({ name, description, price, stock, categoriesIds = [] }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const res = await client.query(
                `INSERT INTO products (name, description, price, stock) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [name, description, price, stock]
            );
            const product = res.rows[0];

            if (Array.isArray(categoriesIds) && categoriesIds.length > 0) {
                const values = categoriesIds.map((catId, idx) => `($1, $${idx + 2})`).join(', ');
                await client.query(
                    `INSERT INTO product_categories (product_id, category_id) VALUES ${values}`,
                    [product.id, ...categoriesIds]
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
    async update(id, data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { name, description, price, stock, categoryIds = [] } = data;

            // Actualiza los campos del producto
            const res = await client.query(
                `UPDATE products 
                 SET name = $1, description = $2, price = $3, stock = $4 
                 WHERE id = $5 RETURNING *`,
                [name, description, price, stock, id]
            );

            // Actualiza las categorías si se proporcionan
            if (Array.isArray(categoryIds)) {
                // Elimina las relaciones actuales
                await client.query(
                    'DELETE FROM product_categories WHERE product_id = $1',
                    [id]
                );
                // Inserta las nuevas relaciones
                if (categoryIds.length > 0) {
                    const values = categoryIds.map((catId, idx) => `($1, $${idx + 2})`).join(', ');
                    await client.query(
                        `INSERT INTO product_categories (product_id, category_id) VALUES ${values}`,
                        [id, ...categoryIds]
                    );
                }
            }

            await client.query('COMMIT');
            // Devuelve el producto actualizado con sus categorías
            return await this.findById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en update:', error);
            throw new Error('No se pudo actualizar el producto');
        } finally {
            client.release();
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

    async findProductsByView() {
        try {
            const res = await pool.query(`
                SELECT 
                p.id, 
                p.name, 
                p.image_url, 
                p.discount_percentage,
                COUNT(v.id) AS total_views
                FROM products p
                LEFT JOIN product_views v ON p.id = v.product_id
                GROUP BY p.id, p.name, p.image_url, p.discount_percentage
                ORDER BY total_views DESC, p.name ASC
                LIMIT 10;
            `);

            return res.rows.map(row => ({
                id: row.id,
                name: row.name,
                imageUrl: row.image_url,
                discount_percentage: row.discount_percentage,
                total_views: parseInt(row.total_views, 10)
            }));
        } catch (error) {
            console.error('Error en findProductsByView:', error);
            throw new Error('No se pudieron obtener los productos por vistas');
        }
    }
}

module.exports = ProductRepository;
