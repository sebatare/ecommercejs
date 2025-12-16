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

    async getProductsByView(){
        const products = await this.productRepository.findProductsByView();
        if (!products || products.length === 0) {
            throw new NotFoundError('No se encontraron productos por vistas');
        }
        return products;
    }

    create(data) {
        console.log("SERVICE - Datos recibidos para crear producto:", data);
        return this.productRepository.create(data);
    }

    update(id, data) {
        return this.productRepository.update(id, data);
    }

    delete(id) {
        return this.productRepository.delete(id);
    }

    deleteByQuantity(id, quantity) {
        console.log(`SERBICIO: ${id} en cantidad: ${quantity}`);
        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor que cero");
        }
        return this.productRepository.deleteByQuantity(id, quantity);
    }
}

module.exports = ProductService;
