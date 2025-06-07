<!-- src/pages/Home/HomePage.vue -->
<template>
    <div class="home-page">
        <h1>Productos</h1>
        <div class="productos-grid">
            <div class="producto-card" v-for="producto in products" :key="producto.id">
                <h2>{{ producto.name }}</h2>
                <p>{{ producto.description }}</p>
                <p><strong>${{ producto.price}}</strong></p>
                <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '../../utils/axios'
import type { Product } from '../../types/index'
import { useCartStore } from '../../store/cart'

const products = ref<Product[]>([])
const cart = useCartStore()

onMounted(async () => {
    const { data } = await api.get<Product[]>('/products')
    products.value = data
    console.log('Productos cargados:', products.value)
})

const agregarAlCarrito = (producto: Product) => {
    cart.agregar(producto)
}
</script>


