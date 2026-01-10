const NotAuthorizedError = require('../../domain/errors/NotAuthorizedError');
const CartValidationError = require('../../domain/errors/cart/CartValidationError');
class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async createCart(userId) {
        if (!userId) {
            throw new CartValidationError('userId es requerido', 'userId');
        }

        try {
            return await this.cartRepository.createCart(userId);
        } catch (error) {
            // PostgreSQL NOT NULL
            if (error.code === '23502') {
                throw new CartValidationError(
                    `El campo ${error.column} no puede ser nulo`,
                    error.column
                );
            }
            // PostgreSQL FK violation
            if (error.code === '23503') {
                throw new CartValidationError(
                    `El recurso relacionado no existe`,
                    error.constraint
                );
            }
            // PostgreSQL Unique violation
            if (error.code === '23505') {
                throw new Error('Ya existe un carrito para este usuario');
            }
            throw new DatabaseError('Error interno al crear el carrito', error);
        }
    }

    //por ahora sin authentication
    async getCart(userId) {
        if (!userId) {
            throw new NotAuthorizedError()
        }

        let cart
        try {
            cart = await this.cartRepository.getCart(userId)
        } catch (error) {
            // Si no existe, lo creamos
            cart = await this.cartRepository.createCart(userId)
            cart.items = []
        }

        return cart
    }


    async getAllCarts() {
        try {
            return await this.cartRepository.getAllCarts();
        } catch (error) {
            throw new Error('Error al obtener los carritos: ' + error.message);
        }
    }

    async updateItems(cartId, updates) {// updates: // [{ productId, quantity }]
        if (!cartId) {
            throw Error('No se proporcionó un ID de carrito');
        }

        await this.cartRepository.updateCartItems(cartId, updates);
    }

    async clearCart(userId) {
        return await this.cartRepository.clearCart(userId);
    }

}

module.exports = CartService;
