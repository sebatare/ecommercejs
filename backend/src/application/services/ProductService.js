const NotFoundError = require("../../domain/errors/NotFoundError");

class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    getAll() {
        return this.productRepository.getAllProducts();
    }

    async getProductById(id) {
        const product = await this.productRepository.getProductById(id);
        if (!product) throw new NotFoundError(`Producto ID: ${id} no encontrado`);
        return product;
    }

    async getProductsByView() {
        const products = await this.productRepository.findProductsByView();
        if (!products) {
            throw new NotFoundError(`Producto ${id} no encontrado`);
        }
        return products;
    }

    async create(data) {
        const productToCreate = {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            stock: data.stock,
            imageUrlp: data.imageUrl ?? '/default',
            discountPercentage: data.discountPercentage ?? 0,
            createdAt: new Date(), // si lo necesitas a nivel dominio
            
        };

        const newProduct = await this.productRepository.create(productToCreate);
        return newProduct
    }


    update(id, data) {
        return this.productRepository.update(id, data);
    }

    delete(id) {
        return this.productRepository.delete(id);
    }

    deleteByQuantity(id, quantity) {
        return this.productRepository.deleteByQuantity(id, quantity);
    }
}

module.exports = ProductService;
