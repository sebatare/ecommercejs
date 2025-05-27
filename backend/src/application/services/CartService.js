const NotAuthorizedError = require('../../domain/errors/NotAuthorizedError');
class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async createCart(userId){
        if (!userId) {
            throw new NotAuthorizedError('No se proporcionó un ID de usuario');
        }
        try {
            return await this.cartRepository.createCart(userId);
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }
    //por ahora sin authentication
    async getCart(){
        try {
            return await this.cartRepository.getCart();
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

    async updateItems(cartId, updates) {
        if (!Array.isArray(updates) || updates.length === 0) {
            throw new Error('Debe proporcionar una lista de productos a actualizar');
        }

        // Validaciones de negocio opcionales:
        for (const { productId, delta } of updates) {
            if (!Number.isInteger(productId) || !Number.isFinite(delta)) {
                throw new Error('Datos de producto inválidos');
            }
        }

        await this.cartRepository.bulkUpdateCartItems(cartId, updates);
    }

    async clearCart(userId) {
        return await this.cartRepository.clearCart(userId);
    }

}

module.exports = CartService;
