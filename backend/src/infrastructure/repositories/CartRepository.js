const pool = require('../db/pool');
const Cart = require('../../domain/Cart');
const CartItem = require('../../domain/CartItem');


class CartRepository {
    //CREATE CART
    async createCart(userId) {
        console.log('Creating cart for user:', userId);
        const res = await pool.query(
            'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
            [userId]
        );
        console.log('Cart created:', res.rows[0]);
        if (res.rows.length === 0) {
            throw new Error('Error creating cart');
        }
        const newCart = new Cart(res.rows[0], { items: [] });
        console.log('New cart:', newCart);
        return newCart;
    }

    //UPDATE ITEM QUANTITY IN CART
    async updateCart(cartId, productId, delta) {
        const res = await pool.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;`,
            [cartId, productId, delta]
        );
        return res.rows[0].quantity;

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