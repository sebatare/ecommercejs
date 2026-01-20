class CartItem {
    constructor({ id, cartId, productId, quantity, price }) {
        this.id = id;
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    getSubtotal() {
        return this.quantity * this.price;
    }
}

module.exports = CartItem;
