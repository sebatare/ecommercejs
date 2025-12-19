<template>
    <div class="w-full max-w-[1400px] mx-auto px-4 py-8">
        <!-- Header con filtros -->
        <div class="mb-12">
            <div class="flex flex-col gap-8">
                <!-- Título -->
                <div class="text-center">
                    <h2
                        class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {{ title }}
                    </h2>
                    <p v-if="subtitle" class="text-lg text-gray-600">{{ subtitle }}</p>
                </div>

                <!-- Filtros -->
                <div v-if="showFilters"
                    class="flex flex-wrap gap-4 items-center justify-center p-6 bg-white rounded-2xl shadow-lg">
                    <!-- Categoría -->
                    <div class="flex items-center gap-3">
                        <label for="categoria-filter"
                            class="flex items-center gap-2 font-semibold text-gray-700 text-sm whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                            Categoría:
                        </label>
                        <select id="categoria-filter" v-model="categoriaSeleccionada"
                            @change="$emit('filter-change', categoriaSeleccionada)"
                            class="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 bg-white cursor-pointer transition-all hover:border-purple-500 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 min-w-[200px]">
                            <option value="">Todas las categorías</option>
                            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                                {{ categoria.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Ordenar -->
                    <div class="flex items-center gap-3">
                        <label for="orden-filter"
                            class="flex items-center gap-2 font-semibold text-gray-700 text-sm whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                            Ordenar por:
                        </label>
                        <select id="orden-filter" v-model="ordenSeleccionado"
                            @change="$emit('sort-change', ordenSeleccionado)"
                            class="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 bg-white cursor-pointer transition-all hover:border-purple-500 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 min-w-[200px]">
                            <option value="">Destacados</option>
                            <option value="price-asc">Precio: Menor a mayor</option>
                            <option value="price-desc">Precio: Mayor a menor</option>
                            <option value="name">Nombre A-Z</option>
                            <option value="newest">Más recientes</option>
                        </select>
                    </div>

                    <!-- Contador de resultados -->
                    <div
                        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full ml-auto">
                        <span class="font-bold text-lg text-white">{{ filteredProducts.length }}</span>
                        <span class="text-sm text-white opacity-90">productos</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Grid de productos -->
        <div v-if="!loading && filteredProducts.length > 0" class="grid gap-8 mb-12" :class="{
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': gridColumns === 4,
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': gridColumns === 3,
            'grid-cols-1 sm:grid-cols-2': gridColumns === 2
        }">
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product"
                @add-to-cart="handleAddToCart" @quick-view="handleQuickView" />
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid gap-8 mb-12" :class="{
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': gridColumns === 4,
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': gridColumns === 3,
            'grid-cols-1 sm:grid-cols-2': gridColumns === 2
        }">
            <div v-for="i in itemsPerPage" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div class="pt-[100%] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                <div class="p-5 space-y-3">
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-2/5"></div>
                    <div class="h-5 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div class="flex justify-between items-center pt-4">
                        <div class="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div class="h-10 bg-gray-200 rounded-full animate-pulse w-28"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && filteredProducts.length === 0" class="text-center py-16">
            <div class="text-gray-300 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                    class="mx-auto">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
            <p class="text-gray-600 mb-8">Intenta ajustar los filtros para ver más resultados</p>
            <button @click="resetFilters"
                class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
                Limpiar filtros
            </button>
        </div>

        <!-- Paginación -->
        <div v-if="!loading && totalPages > 1" class="flex items-center justify-center gap-2 py-8 flex-wrap">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 transition-all hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-gray-200 disabled:hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Anterior
            </button>

            <div class="flex gap-2">
                <button v-for="page in visiblePages" :key="page" @click="typeof page === 'number' && changePage(page)"
                    :disabled="page === '...'" :class="{
                        'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent': page === currentPage,
                        'bg-white text-gray-700 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-1': page !== currentPage && page !== '...',
                        'border-none cursor-default hover:translate-y-0': page === '...'
                    }"
                    class="min-w-[2.5rem] h-10 flex items-center justify-center border-2 rounded-xl font-semibold transition-all">
                    {{ page }}
                </button>
            </div>

            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 transition-all hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-gray-200 disabled:hover:text-gray-700">
                Siguiente
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'
import type { Product, Category } from '../types/index'

interface Props {
    products: Product[]
    categorias?: Category[]
    title?: string
    subtitle?: string
    loading?: boolean
    showFilters?: boolean
    itemsPerPage?: number
    gridColumns?: 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
    categorias: () => [],
    title: 'Nuestros Productos',
    subtitle: '',
    loading: false,
    showFilters: true,
    itemsPerPage: 9,
    gridColumns: 3
})

const emit = defineEmits<{
    'add-to-cart': [product: Product]
    'quick-view': [product: Product]
    'filter-change': [categoryId: string | number]
    'sort-change': [sortType: string]
}>()

const categoriaSeleccionada = ref<string | number>('')
const ordenSeleccionado = ref<string>('')
const currentPage = ref(1)

const filteredProducts = computed(() => {
    let filtered = [...props.products]

    if (categoriaSeleccionada.value) {
        filtered = filtered.filter(product =>
            product.categories?.some(cat => cat.id === Number(categoriaSeleccionada.value))
        )
    }

    switch (ordenSeleccionado.value) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price)
            break
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price)
            break
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name))
            break
        case 'newest':
            filtered.reverse()
            break
    }

    return filtered
})

const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / props.itemsPerPage)
)

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage
    return filteredProducts.value.slice(start, start + props.itemsPerPage)
})

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const range = 2
    const pages: (number | '...')[] = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        pages.push(1)
        if (current > range + 2) pages.push('...')
        for (let i = Math.max(2, current - range); i <= Math.min(total - 1, current + range); i++) {
            pages.push(i)
        }
        if (current < total - range - 1) pages.push('...')
        pages.push(total)
    }
    return pages
})

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const handleAddToCart = (product: Product) => {
    emit('add-to-cart', product)
}

const handleQuickView = (product: Product) => {
    emit('quick-view', product)
}

const resetFilters = () => {
    categoriaSeleccionada.value = ''
    ordenSeleccionado.value = ''
    currentPage.value = 1
}
</script>