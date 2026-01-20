class Product {
    constructor({ id, name, description, price, stock, imageUrl = '', categories = [], discountPercentage, rate }) {
        if (!name) throw new Error('Nombre del producto es obligatorio');
        if (price < 0) throw new Error('El precio no puede ser menor a cero');

        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.discountPercentage = discountPercentage;
        this.rate = rate;
        this.categories = categories;

    }


    //DISPONIBILIDAD DE PRODUCTO
    isAvailable() {
        return this.stock > 0;
    }

    //APLICAR DESCUENTO
    applyDiscount(percent) {
        return this.price * (1 - percent / 100);
    }
}

module.exports = Product;
