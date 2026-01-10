<template>
    <div
        class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        <!-- Image Container -->
        <div class="relative pt-[100%] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img :src="product.imageUrl || 'placeholder.jpg'"
                :alt="product.name"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

            <!-- Overlay con botón -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                <button @click="$emit('quick-view', product)"
                    class="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-50 hover:scale-105">
                    Ver detalles
                </button>
            </div>

            <!-- Badge de descuento -->
            <div v-if="product.discount_percentage"
                class="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg z-10">
                -{{ product.discount_percentage }}%
            </div>

            <!-- Botón de favorito -->
            <button @click="toggleFavorite"
                :class="isFavorite ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100 text-gray-700'"
                class="absolute top-3 right-3 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:scale-110 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                    </path>
                </svg>
            </button>
        </div>

        <!-- Product Info -->
        <div class="p-5 flex flex-col gap-3 flex-1">
            <!-- Categorías -->
            <div class="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                <span v-for="(category, index) in product.categories?.slice(0, 2)" :key="category.id">
                    {{ category.name }}<span v-if="index < Math.min(product.categories.length, 2) - 1">, </span>
                </span>
            </div>

            <!-- Nombre del producto -->
            <h3
                class="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                {{ product.name }}
            </h3>

            <!-- Descripción -->
            <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {{ product.description }}
            </p>

            <!-- Rating -->
            <div v-if="product.price" class="flex items-center gap-2">
                <div class="flex gap-0.5">
                    <span v-for="i in 5" :key="i"
                        :class="i <= Math.floor(product.price) ? 'text-yellow-400' : 'text-gray-300'" class="text-base">
                        ★
                    </span>
                </div>
                <span class="text-sm text-gray-600 font-semibold">{{ product.rate }}</span>
            </div>

            <!-- Footer con precio y botón -->
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div class="flex flex-col">
                    <span v-if="product.discount_percentage" class="text-sm text-gray-400 line-through">
                        ${{ product.price }}
                    </span>
                    <span
                        class="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${{ finalPrice }}
                    </span>
                </div>

                <button @click="$emit('add-to-cart', product)"
                    class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Agregar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '../types/index'

interface Props {
    product: Product
}

const props = defineProps<Props>()

defineEmits<{
    'add-to-cart': [product: Product]
    'quick-view': [product: Product]
}>()

const isFavorite = ref(false)

const finalPrice = computed(() => {
    if (props.product.discount_percentage) {
        const price = props.product.price
        const discount = props.product.discount_percentage
        return (price - (price * discount / 100)).toFixed(2)
    }
    return props.product.price.toFixed(2)
})

const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
}
</script>