<template>
    <div class="home-page">
        <!-- Carrusel Hero -->
        <HeroCarousel />

        <!-- Buscador de Productos -->
        <section class="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="relative max-w-2xl mx-auto">
                    <!-- Input de búsqueda -->
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="🔍 Busca un producto..."
                            @input="filterProducts" @focus="showSuggestions = true" @blur="hideSuggestions"
                            class="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 transition-colors text-gray-900 placeholder-gray-500" />
                        <button v-if="searchQuery" @click="clearSearch"
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            ✕
                        </button>
                    </div>

                    <!-- Sugerencias de productos -->
                    <div v-if="showSuggestions && searchQuery"
                        class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                        <div v-if="suggestedProducts.length > 0" class="p-2">
                            <div v-for="product in suggestedProducts.slice(0, 8)" :key="product.id"
                                @click="goToProduct(product)"
                                class="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors group">
                                <img :src="product.imageUrl" :alt="product.name" class="w-10 h-10 rounded object-cover">
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 truncate">
                                        {{ product.name }}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        ${{ product.price.toFixed(2) }}
                                    </p>
                                </div>
                                <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div v-else class="p-6 text-center text-gray-500">
                            <p>No se encontraron productos</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

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
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../utils/api-public'
import type { Product, Category } from '../../types/index'
import { useCartStore } from '../../store/cart'
import HeroCarousel from '../../components/HeroCarousel.vue'
import ProductCard from '../../components/ProductCard.vue'
import SkeletonCard from '../../components/SkeletonCard.vue'
import ProductsList from '../../components/ProductsList.vue'

const router = useRouter()
const products = ref<Product[]>([])
const categorias = ref<Category[]>([])
const productsOnSale = ref<Product[]>([])
const loadingProducts = ref(true)
const loadingTopProducts = ref(true)
const searchQuery = ref('')
const showSuggestions = ref(false)

const cart = useCartStore()

const suggestedProducts = computed(() => {
    if (!searchQuery.value.trim()) return []

    const query = searchQuery.value.toLowerCase()
    return products.value.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    )
})

const filterProducts = () => {
    // Mostrar sugerencias mientras escribe
    showSuggestions.value = searchQuery.value.length > 0
}

const clearSearch = () => {
    searchQuery.value = ''
    showSuggestions.value = false
}

const hideSuggestions = () => {
    // Pequeño delay para permitir click en sugerencias
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

const goToProduct = (product: Product) => {
    router.push(`/products/${product.id}`)
    searchQuery.value = ''
    showSuggestions.value = false
}

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