const NotFoundError = require("../../domain/errors/NotFoundError");

// src/application/ProductService.js
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    getAll() {
        return this.productRepository.findAll();
    }

    async getById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new NotFoundError(`Producto ID: ${id} no encontrado`);
        }
        return product;
    }

    create(data) {
        return this.productRepository.create(data);
    }

    update(id, data) {
        return this.productRepository.update(id, data);
    }

    delete(id) {
        return this.productRepository.delete(id);
    }
}

module.exports = ProductService;
