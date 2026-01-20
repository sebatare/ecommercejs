class Cart {
  constructor({ id, userId, createdAt, items = [] }) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.items = items; // Array de CartItem
    
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  clearCart() {
    this.items = [];
  }
}

module.exports = Cart;