const pool = require('../db/pool');
const Product = require('../../domain/Product');

class ProductRepository {

    async getAllProducts() {
        const res = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.created_at,
                p.price::float,
                p.stock,
                p.discount_percentage::float,
                p.image_url,
                COALESCE(
                    json_agg(
                        jsonb_build_object('id', c.id, 'name', c.name)
                    ) FILTER (WHERE c.id IS NOT NULL),
                    '[]'
                ) AS categories
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            GROUP BY p.id
            ORDER BY p.id
        `);

        return res.rows.map(row => new Product({
            id: row.id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            stock: row.stock,
            imageUrl: row.image_url || '/default',
            categories: row.categories,
            discount_percentage: Number(row.discount_percentage)
        }));
    }

    async getProductById(id) {
        const res = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.description,
                p.created_at,
                p.price::float,
                p.stock,
                p.discount_percentage::float,
                p.image_url,
                COALESCE(
                    json_agg(
                        jsonb_build_object('id', c.id, 'name', c.name)
                    ) FILTER (WHERE c.id IS NOT NULL),
                    '[]'
                ) AS categories
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.id = $1
            GROUP BY p.id
        `, [id]);

        if (!res.rows[0]) return null;
    

        return new Product({
            id: res.rows[0].id,
            name: res.rows[0].name,
            description: res.rows[0].description,
            price: Number(res.rows[0].price),
            stock: res.rows[0].stock,
            imageUrl: res.rows[0].image_url || '/default',
            categories: res.rows[0].categories,
            discountPercentage: Number(res.rows[0].discount_percentage)
        });
    }

    async create({ name, description, price, stock, imageUrl = '/default', discountPercentage }) {
        const res = await pool.query(
            `INSERT INTO products (name, description, price, stock, image_url, discount_percentage)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING *`,
            [name, description, price, stock, imageUrl, discountPercentage]
        );

        const row = res.rows[0];
        
        return new Product({
            id: row.id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            stock: row.stock,
            imageUrl: row.image_url || '/default',
            categories: [],
            discountPercentage: Number(row.discount_percentage)
        });
    }

    async update(id, { name, description, price, stock, imageUrl, discountPercentage }) {
        const res = await pool.query(`
            UPDATE products
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                stock = COALESCE($4, stock),
                image_url = COALESCE($5, image_url),
                discount_percentage = COALESCE($6, discount_percentage),
                updated_at = NOW()
            WHERE id = $7
            RETURNING *
        `, [name, description, price, stock, imageUrl, discountPercentage, id]);

        if (!res.rows[0]) return null;

        const row = res.rows[0];
        return new Product({
            id: row.id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            stock: row.stock,
            imageUrl: row.image_url || '/default',
            categories: [],
            discount_percentage: Number(row.discount_percentage)
        });
    }

    async delete(id) {
        await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
    }

    async deleteByQuantity(id, quantity) {
        if (quantity <= 0) throw new Error("La cantidad debe ser mayor que cero");

        const res = await pool.query(
            `UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING *`,
            [quantity, id]
        );

        if (!res.rows[0]) throw new Error("Producto no encontrado o stock insuficiente");

        return new Product({
            id: res.rows[0].id,
            name: res.rows[0].name,
            description: res.rows[0].description,
            price: Number(res.rows[0].price),
            stock: res.rows[0].stock,
            imageUrl: res.rows[0].image_url || '/default',
            categories: [],
            discount_percentage: Number(res.rows[0].discount_percentage)
        });
    }

    async findProductsByView() {
        const res = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.image_url,
                p.discount_percentage::float,
                p.price::float,
                COALESCE(p.rate, 3) AS rate,
                COUNT(v.id) AS total_views
            FROM products p
            LEFT JOIN product_views v ON p.id = v.product_id
            GROUP BY p.id
            ORDER BY total_views DESC, p.name ASC
            LIMIT 10
        `);

        return res.rows.map(row => ({
            id: row.id,
            name: row.name,
            imageUrl: row.image_url || '/default',
            discountPercentage: Number(row.discount_percentage),
            price: Number(row.price),
            rate: Number(row.rate),
            totalViews: Number(row.total_views)
        }));
    }
}

module.exports = ProductRepository;
