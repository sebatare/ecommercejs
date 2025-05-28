const pool = require('../db/pool');
const Cart = require('../../domain/Cart');
const CartItem = require('../../domain/CartItem');


class CartRepository {
    constructor() {

    }
    async createCart(userId) {
        try {
            const res = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
                [userId]
            );
            return new Cart(res.rows[0]);
        } catch (error) {
            throw error; // No lo envolvemos
        }
    }

    // Obtiene el carrito y sus items para un usuario
    async getCart(userId) {
        // Primero obtenemos el carrito del usuario
        const cartRes = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1',
            [userId]
        );
        if (cartRes.rows.length === 0) {
            throw new Error('Usuario no tiene un carrito activo');
        }
        const cart = new Cart(cartRes.rows[0]);

        // Ahora obtenemos los items del carrito
        const itemsRes = await pool.query(
            `SELECT ci.product_id, ci.quantity, p.name as product_name
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1`,
            [cart.id]
        );
        // Mapear para incluir nombre y cantidad
        cart.items = itemsRes.rows.map(row => ({
            productId: row.product_id,
            productName: row.product_name,
            quantity: row.quantity
        }));

        return cart;
    }

    async getAllCarts() {
        const res = await pool.query(`
            SELECT * FROM carts
        `);
        return res.rows.map(row => new Cart(row));
    }

    //UPDATE ITEM QUANTITY IN CART
    async updateCartItems(cartId, items) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Elimina los productos que NO están en el array recibido
            const productIds = items.map(item => item.productId);
            if (productIds.length > 0) {
                await client.query(
                    `DELETE FROM cart_items
                     WHERE cart_id = $1
                     AND product_id NOT IN (${productIds.map((_, i) => `$${i + 2}`).join(',')})`,
                    [cartId, ...productIds]
                );
            } else {
                // Si no hay productos, elimina todos los items del carrito
                await client.query(
                    `DELETE FROM cart_items WHERE cart_id = $1`,
                    [cartId]
                );
            }

            // 2. Inserta o actualiza los productos recibidos
            for (const { productId, quantity } of items) {
                if (quantity <= 0) continue; // Opcional: ignora cantidades no válidas
                await client.query(`
                    INSERT INTO cart_items (cart_id, product_id, quantity)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (cart_id, product_id)
                    DO UPDATE SET quantity = EXCLUDED.quantity
                `, [cartId, productId, quantity]);
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }


    async removeItem(cartId, productId) {
        await pool.query(
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cartId, productId]
        );

    }

    //DELETE CART_ITEMS BY CART_ID
    async clearCart(cartId) {
        await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
    }


}

module.exports = CartRepository;