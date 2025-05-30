<template>
  <div class="cart-page">
    <h1>Carrito</h1>
    <div v-if="cart.items.length === 0">Tu carrito está vacío</div>

    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>${{ item.price }}</td>
            <td>
              <input
                type="number"
                min="1"
                v-model.number="item.quantity"
                @change="actualizar(item.id, item.quantity)"
              />
            </td>
            <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button @click="eliminar(item.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-total">
        <p>Total: <strong>${{ cart.total.toFixed(2) }}</strong></p>
        <button @click="cart.limpiar">Vaciar carrito</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../store/cart'
const cart = useCartStore()

const actualizar = (id: number, cantidad: number) => {
  cart.actualizarCantidad(id, cantidad)
}

const eliminar = (id: number) => {
  cart.eliminar(id)
}
</script>

<style scoped>
.cart-page {
  padding: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
.cart-total {
  margin-top: 1rem;
  text-align: right;
}
</style>
