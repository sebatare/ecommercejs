const NotAuthorizedError = require('../../domain/errors/NotAuthorizedError');
class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async createCart(userId) {
        if (!userId) {
            throw new NotAuthorizedError();
        }
        return await this.cartRepository.createCart(userId);
    }

    async updateCartItem(cartId, productId, delta) {
        const quantity = await this.cartRepository.updateCart(cartId, productId, delta);

        // Regla de negocio: si la cantidad llega a 0 o menos, eliminar el item
        if (quantity <= 0) {
            await this.cartRepository.removeItem(cartId, productId);
        }

        return quantity;
    }

    async removeItem(itemId) {
        return await this.cartRepository.removeItem(itemId);
    }

    async clearCart(cartId) {
        return await this.cartRepository.clearCart(cartId);
    }

    async getCartByUserId(userId) {
        const cart = await this.cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new NotFoundError(`Carrito de compras para el usuario ID: ${userId} no encontrado`);
        }
        return cart;
    }
}

module.exports = CartService;
