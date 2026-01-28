<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <!-- Breadcrumb -->
        <div class="max-w-7xl mx-auto mb-8">
            <nav class="flex items-center gap-2 text-sm text-gray-600">
                <router-link to="/" class="hover:text-indigo-600 transition-colors">Inicio</router-link>
                <span>/</span>
                <span class="text-gray-900 font-semibold">{{ product?.name || 'Cargando...' }}</span>
            </nav>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Image Skeleton -->
                <div class="aspect-square bg-gray-300 rounded-3xl animate-pulse"></div>
                <!-- Info Skeleton -->
                <div class="space-y-6">
                    <div class="h-8 bg-gray-300 rounded-lg w-3/4 animate-pulse"></div>
                    <div class="h-6 bg-gray-300 rounded-lg w-1/2 animate-pulse"></div>
                    <div class="h-12 bg-gray-300 rounded-lg w-2/3 animate-pulse"></div>
                    <div class="h-12 bg-indigo-300 rounded-xl animate-pulse"></div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-7xl mx-auto">
            <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <p class="text-red-800 font-semibold">{{ error }}</p>
                <router-link to="/" class="text-red-600 hover:text-red-800 text-sm mt-4 inline-block">
                    ← Volver a productos
                </router-link>
            </div>
        </div>

        <!-- Product Details -->
        <div v-else-if="product" class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Image Gallery -->
                <div class="space-y-6">
                    <!-- Main Image -->
                    <div
                        class="group relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl cursor-zoom-in">
                        <img :src="product.imageUrl || 'placeholder.jpg'" :alt="product.name"
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />

                        <!-- Zoom Overlay -->
                        <div
                            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div
                                class="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Ampliar imagen
                            </div>
                        </div>

                        <!-- Discount Badge -->
                        <div v-if="product.discount_percentage"
                            class="absolute top-6 left-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl z-10 animate-bounce">
                            -{{ product.discount_percentage }}% OFF
                        </div>
                    </div>

                    <!-- Image Info -->
                    <div class="flex gap-4 text-sm text-gray-600">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            Imagen de alta resolución
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                            </svg>
                            Guardable
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="flex flex-col gap-6">
                    <!-- Categorías -->
                    <div class="flex flex-wrap gap-2">
                        <span v-for="category in product.categories" :key="category.id"
                            class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                            {{ category.name }}
                        </span>
                    </div>

                    <!-- Título -->
                    <div>
                        <h1
                            class="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            {{ product.name }}
                        </h1>
                        <p class="text-gray-600 leading-relaxed text-lg">
                            {{ product.description }}
                        </p>
                    </div>

                    <!-- Rating -->
                    <div class="flex items-center gap-4 pb-6 border-b border-gray-200">
                        <div class="flex gap-1">
                            <span v-for="i in 5" :key="i"
                                :class="i <= Math.floor(product.rate || 0) ? 'text-yellow-400' : 'text-gray-300'"
                                class="text-2xl">
                                ★
                            </span>
                        </div>
                        <span class="font-bold text-gray-900">{{ product.rate || 0 }}/5</span>
                        <span class="text-gray-600">{{ Math.floor(Math.random() * 500) + 50 }} reseñas</span>
                    </div>

                    <!-- Precio -->
                    <div class="space-y-3">
                        <div class="flex items-baseline gap-4">
                            <span v-if="product.discount_percentage"
                                class="text-2xl text-gray-400 line-through font-semibold">
                                ${{ product.price.toFixed(2) }}
                            </span>
                            <span
                                class="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ${{ finalPrice }}
                            </span>
                            <span v-if="product.discount_percentage"
                                class="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold">
                                Ahorras ${{ savedAmount }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 font-semibold">
                            ✓ Envío gratis en compras mayores a $100
                        </p>
                    </div>

                    <!-- Stock Info -->
                    <div class="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div class="flex items-center gap-3">
                            <div :class="product.stock > 0 ? 'bg-green-100' : 'bg-red-100'"
                                class="w-12 h-12 rounded-full flex items-center justify-center">
                                <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'"
                                    class="font-bold text-lg">
                                    {{ product.stock }}
                                </span>
                            </div>
                            <div>
                                <p class="font-bold text-gray-900">
                                    {{ product.stock > 0 ? `${product.stock} en stock` : 'Sin stock' }}
                                </p>
                                <p v-if="product.stock <= 5 && product.stock > 0"
                                    class="text-sm text-orange-600 font-semibold">
                                    ⚠️ Quedan pocas unidades
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-4 pt-6">
                        <button @click="addToCart" :disabled="product.stock === 0"
                            :class="product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'"
                            class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {{ product.stock === 0 ? 'Sin stock' : 'Agregar al carrito' }}
                        </button>
                        <button @click="toggleFavorite"
                            :class="isFavorite ? 'bg-red-100 text-red-600 shadow-lg' : 'bg-gray-100 text-gray-600'"
                            class="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <!-- Features -->
                    <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                        <div class="text-center">
                            <div class="text-3xl mb-2">🚚</div>
                            <p class="text-sm font-semibold text-gray-900">Envío rápido</p>
                            <p class="text-xs text-gray-600">2-3 días hábiles</p>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl mb-2">🔒</div>
                            <p class="text-sm font-semibold text-gray-900">Seguro</p>
                            <p class="text-xs text-gray-600">Pago protegido</p>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl mb-2">↩️</div>
                            <p class="text-sm font-semibold text-gray-900">Devolución</p>
                            <p class="text-xs text-gray-600">30 días gratis</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products Section -->
            <div v-if="relatedProducts.length > 0" class="mt-20 pt-12 border-t border-gray-200">
                <h2
                    class="text-3xl font-black mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Productos relacionados
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="relProduct in relatedProducts.slice(0, 4)" :key="relProduct.id"
                        class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                        @click="navigateToProduct(relProduct.id)">
                        <div class="pt-[100%] relative overflow-hidden bg-gray-100">
                            <img :src="relProduct.imageUrl" :alt="relProduct.name"
                                class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div class="p-4">
                            <h3
                                class="font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                {{ relProduct.name }}
                            </h3>
                            <div class="flex items-center justify-between mt-4">
                                <span class="text-xl font-black text-indigo-600">
                                    ${{ relProduct.price.toFixed(2) }}
                                </span>
                                <span class="text-yellow-400">★ {{ relProduct.rate }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../utils/api-public'
import { useCartStore } from '../../store/cart'
import type { Product } from '../../types'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isFavorite = ref(false)

const productId = route.params.id as string

const finalPrice = computed(() => {
    if (!product.value) return '0.00'
    if (product.value.discount_percentage) {
        const price = product.value.price
        const discount = product.value.discount_percentage
        return (price - (price * discount / 100)).toFixed(2)
    }
    return product.value.price.toFixed(2)
})

const savedAmount = computed(() => {
    if (!product.value || !product.value.discount_percentage) return '0.00'
    const price = product.value.price
    const discount = product.value.discount_percentage
    return (price * discount / 100).toFixed(2)
})

const fetchProduct = async () => {
    loading.value = true
    error.value = null
    try {
        const { data } = await api.get<Product>(`/products/${productId}`)
        product.value = data

        // Cargar productos relacionados de la misma categoría
        if (product.value.categories && product.value.categories.length > 0) {
            const categoryId = product.value.categories[0].id
            const { data: relProducts } = await api.get<Product[]>(`/products?category=${categoryId}&limit=8`)
            relatedProducts.value = relProducts.filter(p => p.id !== product.value?.id)
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error cargando el producto'
        console.error('Error:', err)
    } finally {
        loading.value = false
    }
}

const addToCart = async () => {
    if (!product.value || product.value.stock === 0) return

    try {
        await cart.agregar(product.value, 1)
        // Mostrar feedback visual
        const button = event?.target as HTMLElement
        const originalText = button?.textContent
        button.textContent = '✓ Agregado al carrito'
        setTimeout(() => {
            if (button) button.textContent = originalText || ''
        }, 2000)
    } catch (err) {
        console.error('Error agregando al carrito:', err)
    }
}

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
}

const navigateToProduct = (id: number) => {
    router.push(`/products/${id}`)
}

onMounted(() => {
    fetchProduct()
})
</script>

<style scoped>
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-bounce {
    animation: float 3s ease-in-out infinite;
}
</style>
