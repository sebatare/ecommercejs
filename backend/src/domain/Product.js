class Product {
    constructor({ id, name, description, createdAt, price, stock }) {
        if (!name) throw new Error('Product name is required');
        if (price < 0) throw new Error('Price cannot be negative');

        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = new Date();
        this.price = price;
        this.stock = stock;
    }
}

module.exports = Product;
