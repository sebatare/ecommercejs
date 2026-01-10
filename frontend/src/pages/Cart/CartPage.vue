<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <h1>
          <Icon icon="mdi:cart" width="32" />
          Mi Carrito
        </h1>
        <span v-if="cart.cantidadTotal > 0" class="item-count">
          {{ cart.cantidadTotal }} {{ cart.cantidadTotal === 1 ? 'producto' : 'productos' }}
        </span>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cart.isEmpty" class="empty-cart">
        <div class="empty-icon">
          <Icon icon="mdi:cart-outline" width="120" />
        </div>
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega productos para comenzar a comprar!</p>
        <router-link to="/" class="continue-shopping">
          <Icon icon="mdi:arrow-left" width="20" />
          Continuar comprando
        </router-link>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cart.items" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'" :alt="item.productName" />
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ item.productName }}</h3>
              <p class="item-price">${{item.price}}</p>
            </div>

            <div class="item-quantity">
              <button 
                @click="decrementar(item.productId)" 
                class="qty-btn"
              >
                <Icon icon="mdi:minus" width="18" />
              </button>
              <div class="qty-display">{{ item.quantity }}</div>
              <button 
                @click="incrementar(item.productId)" 
                class="qty-btn"
              >
                <Icon icon="mdi:plus" width="18" />
              </button>
            </div>

            <div class="item-subtotal">
              <p class="subtotal-label">Subtotal</p>
              <p class="subtotal-amount">${{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
            </div>

            <button 
              @click="eliminar(item.productId)" 
              class="remove-btn"
              title="Eliminar producto"
            >
              <Icon icon="mdi:trash-can-outline" width="22" />
            </button>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-summary">
          <div class="summary-card">
            <h2>Resumen del pedido</h2>
            
            <div class="summary-row">
              <span>Subtotal ({{ cart.cantidadTotal }} items)</span>
              <span>${{ cart.total.toFixed(2) }}</span>
            </div>

            <div class="summary-row">
              <span>Envío</span>
              <span class="free-shipping">Gratis</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span>Total</span>
              <span class="total-amount">${{ cart.total.toFixed(2) }}</span>
            </div>

            <button class="checkout-btn" >
              <Icon icon="mdi:lock-outline" width="20" />
              Proceder al pago
            </button>

            <button 
              @click="limpiarCarrito" 
              class="clear-btn"
              
            >
              <Icon icon="mdi:delete-outline" width="20" />
              Vaciar carrito
            </button>

            <router-link to="/" class="continue-link">
              <Icon icon="mdi:arrow-left" width="18" />
              Continuar comprando
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../store/cart'
import { Icon } from '@iconify/vue'

const cart = useCartStore()

const incrementar = async (productId: number) => {
  await cart.incrementar(productId)
}

const decrementar = async (productId: number) => {
  await cart.decrementar(productId)
}

const eliminar = async (productId: number) => {
  await cart.eliminar(productId)
}

const limpiarCarrito = async () => {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    await cart.limpiar()
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-header h1 {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 2rem;
  color: #2d3748;
  margin: 0;
}

.item-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Carrito vacío */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.empty-cart h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: #718096;
  margin-bottom: 2rem;
}

.continue-shopping {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.continue-shopping:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Contenido del carrito */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

/* Items del carrito */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cart-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.cart-item:hover::before {
  opacity: 1;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: #f7fafc;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.item-price {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

/* Cantidad */
.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f7fafc;
  padding: 0.5rem;
  border-radius: 12px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.qty-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-display {
  width: 50px;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

/* Subtotal */
.item-subtotal {
  text-align: right;
  min-width: 100px;
}

.subtotal-label {
  font-size: 0.85rem;
  color: #718096;
  margin: 0 0 0.25rem 0;
}

.subtotal-amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* Botón eliminar */
.remove-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover:not(:disabled) {
  background: #ff6b6b;
  color: white;
  transform: scale(1.05);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Resumen del carrito */
.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.summary-card h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #4a5568;
}

.free-shipping {
  color: #48bb78;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 1.5rem 0;
}

.total-row {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.total-amount {
  color: #667eea;
  font-size: 1.6rem;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  margin-bottom: 1rem;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  border: 2px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.clear-btn:hover:not(:disabled) {
  background: rgba(255, 107, 107, 0.2);
  border-color: #ff6b6b;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.continue-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 0.8rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.continue-link:hover {
  background: rgba(102, 126, 234, 0.1);
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #667eea;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-quantity,
  .item-subtotal {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .remove-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .cart-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .cart-header h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding: 1rem 0.5rem;
  }

  .summary-card {
    padding: 1.5rem;
  }
}
</style>