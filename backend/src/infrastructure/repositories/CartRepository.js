const pool = require('../db/pool');
const Cart = require('../../domain/Cart');
const CartItem = require('../../domain/CartItem');
const DBError = require('../../domain/errors/DBError');


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
            throw new DBError('Error al crear el carrito: ' + error.message);
        }
    }

    async getAllCarts() {
        const res = await pool.query(`
            SELECT * FROM carts
        `);
        return res.rows.map(row => new Cart(row));
    }

    //UPDATE ITEM QUANTITY IN CART
    async updateCartItem(cartId, items) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const { productId, delta } of items) {
                // Paso 1: INSERT o UPDATE
                await client.query(`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      `, [cartId, productId, delta]);

                // Paso 2: Eliminar si cantidad final es <= 0
                await client.query(`
        DELETE FROM cart_items
        WHERE cart_id = $1 AND product_id = $2 AND quantity <= 0
      `, [cartId, productId]);
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

    //GET PRODUCT FROM CART BY USER ID
    async getCartByUserId(userId) {
        const res = await pool.query(`
            SELECT ci.product_id, p.name, p.price, ci.quantity,
                (p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1
        `, [userId]);

        return res.rows.map(row => new CartItem(row));
    }
}

module.exports = CartRepository;