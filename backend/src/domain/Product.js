class Product {
    constructor({ id, name, description, createdAt, price, stock }) {
        if (!name) throw new Error('Product name is required');
        if (price < 0) throw new Error('Price cannot be negative');

        this.id = id ?? null;
        this.name = name;
        this.description = description ?? '';
        this.createdAt = createdAt ?? new Date();
        this.price = price;
        this.stock = stock ?? 0;
    }
}

module.exports = Product;
