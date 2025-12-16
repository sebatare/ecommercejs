<template>
    <div class="home-page">
        <!-- Carrusel Hero -->
        <HeroCarousel />

        <!-- Sección de Top Más Vendidos -->
        <section class="max-w-7xl mx-auto px-4 py-16">
            <div class="flex items-center gap-3 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-purple-600">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <h2
                    class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Más Vendidos
                </h2>
            </div>

            <!-- Lista horizontal de productos top -->
            <div v-if="!loadingTopProducts" class="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                <div v-for="product in productsOnSale" :key="product.id" class="min-w-[280px]">
                    <ProductCard :product="product" @add-to-cart="agregarAlCarrito" />
                </div>
            </div>

            <!-- Loading skeleton para top productos -->
            <div v-else class="flex gap-6 overflow-x-auto pb-4">
                <SkeletonCard v-for="i in 6" :key="i" class="min-w-[280px]" />
            </div>
        </section>

        <!-- Sección de Todos los Productos con Filtros -->
        <section class="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
            <ProductsList :products="products" :categorias="categorias" :loading="loadingProducts"
                title="Explora nuestros productos" subtitle="Encuentra lo que necesitas en nuestra amplia selección"
                :show-filters="true" :items-per-page="9" :grid-columns="3" @add-to-cart="agregarAlCarrito"
                @quick-view="verDetalleProducto" />
        </section>

        <!-- Sección de Beneficios -->
        <section class="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 text-white">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold mb-2">Envío Gratis</h4>
                        <p class="text-white/80">En compras mayores a $50</p>
                    </div>

                    <div class="text-center">
                        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                </polygon>
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold mb-2">Garantía Premium</h4>
                        <p class="text-white/80">2 años de garantía extendida</p>
                    </div>

                    <div class="text-center">
                        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                </path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold mb-2">Satisfacción 100%</h4>
                        <p class="text-white/80">30 días para devoluciones</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '../../utils/api-public'
import type { Product, Category } from '../../types/index'
import { useCartStore } from '../../store/cart'
import HeroCarousel from '../../components/HeroCarousel.vue'
import ProductCard from '../../components/ProductCard.vue'
import SkeletonCard from '../../components/SkeletonCard.vue'
import ProductsList from '../../components/ProductsList.vue'

const products = ref<Product[]>([])
const categorias = ref<Category[]>([])
const productsOnSale = ref<Product[]>([])
const loadingProducts = ref(true)
const loadingTopProducts = ref(true)

const cart = useCartStore()

onMounted(async () => {
    try {
        // Cargar productos normales
        const { data } = await api.get<Product[]>('/products')
        products.value = data

        // Extraer categorías únicas
        const categoriasUnicas: Record<number, Category> = {}
        data.forEach((producto) => {
            producto.categories.forEach((cat) => {
                categoriasUnicas[cat.id] = cat
            })
        })
        categorias.value = Object.values(categoriasUnicas)

        loadingProducts.value = false

        // Cargar productos más vendidos
        const { data: ProductosByView } = await api.get<Product[]>('/products/views/top')
        productsOnSale.value = ProductosByView
        loadingTopProducts.value = false

    } catch (e) {
        console.error('Error al cargar productos:', e)
        loadingProducts.value = false
        loadingTopProducts.value = false
    }
})

const agregarAlCarrito = (producto: Product) => {
    cart.agregar(producto)
    // Opcional: Mostrar notificación de éxito
}

const verDetalleProducto = (producto: Product) => {
    // Implementar lógica para ver detalle (modal, navegación, etc.)
    console.log('Ver detalle:', producto)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>