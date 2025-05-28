const NotAuthorizedError = require('../../domain/errors/NotAuthorizedError');

const UniqueConstraintError = require('../../domain/errors/UniqueConstraintError');

class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async createCart(userId) {
        if (!userId) {
            throw new Error('No se proporcionó un ID de usuario');
        }

        try {
            return await this.cartRepository.createCart(userId);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Ya existe un carrito para este usuario');
            }
            throw new Error('Error inesperado al crear el carrito');
        }
    }

    //por ahora sin authentication
    async getCart(userId) {
        try {
            return await this.cartRepository.getCart(userId);
        } catch (error) {
            throw new Error('Error al obtener el carrito: ' + error.message);
        }
    }

    async getAllCarts() {
        try {
            return await this.cartRepository.getAllCarts();
        } catch (error) {
            throw new Error('Error al obtener los carritos: ' + error.message);
        }
    }

    async updateItems(cartId, updates) {// updates: // [{ productId, quantity }]
        if(!cartId){
            throw Error('No se proporcionó un ID de carrito');
        }

        await this.cartRepository.updateCartItems(cartId, updates);
    }

    async clearCart(userId) {
        return await this.cartRepository.clearCart(userId);
    }

}

module.exports = CartService;
