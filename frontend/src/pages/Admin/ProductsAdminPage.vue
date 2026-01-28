<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4">
                    <router-link to="/admin" class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Volver al panel">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="text-gray-700">
                            <path d="M15 18l-6-6 6-6"></path>
                        </svg>
                    </router-link>
                    <div>
                        <h1
                            class="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Gestión de Productos
                        </h1>
                        <p class="text-gray-600">Administra el inventario de tu tienda</p>
                    </div>
                </div>
                <button @click="openModal()"
                    class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                    + Agregar Producto
                </button>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div class="flex gap-4 flex-wrap">
                    <input v-model="searchQuery" type="text" placeholder="🔍 Buscar por nombre..."
                        class="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" />
                    <select v-model="sortKey" @change="updateSort"
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                        <option value="">Ordenar por</option>
                        <option value="name">Nombre (A-Z)</option>
                        <option value="price">Precio (menor)</option>
                        <option value="stock">Stock (menor)</option>
                    </select>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="inline-block">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <p class="text-gray-600 mt-4">Cargando productos...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="products.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="text-6xl mb-4">📦</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">No hay productos</h3>
                <p class="text-gray-600 mb-6">Comienza creando tu primer producto</p>
                <button @click="openModal()"
                    class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                    Crear Producto
                </button>
            </div>

            <!-- Products Grid -->
            <div v-else class="space-y-6">
                <!-- Table for Desktop -->
                <div class="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Producto</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Categoría</th>
                                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in paginatedProducts" :key="product.id"
                                    class="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-4">
                                            <img :src="product.imageUrl" :alt="product.name"
                                                class="w-12 h-12 rounded-lg object-cover">
                                            <div>
                                                <p class="font-semibold text-gray-900">{{ product.name }}</p>
                                                <p class="text-xs text-gray-500">#{{ product.id }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <p class="font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span :class="[
                                            'px-3 py-1 rounded-full text-sm font-semibold',
                                            product.stock > 10 ? 'bg-green-100 text-green-700' :
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                        ]">
                                            {{ product.stock }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex gap-2 flex-wrap">
                                            <span v-for="cat in product.categories" :key="cat.id"
                                                class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                                                {{ cat.name }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex justify-center gap-2">
                                            <button @click="openModal(product)"
                                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar">
                                                ✏️
                                            </button>
                                            <button @click="askDeleteProduct(product)"
                                                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Cards for Mobile -->
                <div class="md:hidden space-y-4">
                    <div v-for="product in paginatedProducts" :key="product.id"
                        class="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                        <img :src="product.imageUrl" :alt="product.name"
                            class="w-full h-40 rounded-lg object-cover mb-4">
                        <h3 class="font-bold text-gray-900 mb-2">{{ product.name }}</h3>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="text-xs text-gray-600">Precio</p>
                                <p class="text-lg font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600">Stock</p>
                                <span :class="[
                                    'px-2 py-1 rounded text-sm font-semibold inline-block',
                                    product.stock > 10 ? 'bg-green-100 text-green-700' :
                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                ]">
                                    {{ product.stock }}
                                </span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="openModal(product)"
                                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Editar
                            </button>
                            <button @click="askDeleteProduct(product)"
                                class="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
                    <button :disabled="currentPage === 1" @click="currentPage--"
                        class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                        ← Anterior
                    </button>
                    <span class="text-gray-700 font-semibold">
                        Página {{ currentPage }} de {{ totalPages }}
                    </span>
                    <button :disabled="currentPage === totalPages" @click="currentPage++"
                        class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                        Siguiente →
                    </button>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <ProductFormModal v-if="showModal" :product="selectedProduct" @close="showModal = false"
            @saved="onProductSaved" />
        <ConfirmDialog v-if="showConfirm" :message="`¿Eliminar '${productToDelete?.name}'?`" :showQuantityInput="true"
            :maxStock="productToDelete?.stock || 0" @confirm="confirmDelete" @deleteAll="deleteAllProduct"
            @cancel="cancelDelete" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import api from './../../utils/api-auth'
import ProductFormModal from '../../components/ProductFormModal.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import type { Product } from '../../types/index'

const products = ref<Product[]>([])
const loading = ref(true)
const searchQuery = ref('')
const sortKey = ref('name')
const itemsPerPage = 10
const currentPage = ref(1)
const showModal = ref(false)
const selectedProduct: Ref<Product | null> = ref(null)
const showConfirm = ref(false)
const productToDelete: Ref<Product | null> = ref(null)

const filteredProducts = computed(() => {
    let filtered = products.value.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    // Aplicar ordenamiento
    if (sortKey.value) {
        filtered = filtered.sort((a, b) => {
            let aVal: any = a[sortKey.value as keyof Product]
            let bVal: any = b[sortKey.value as keyof Product]

            // Convertir a minúsculas si son strings
            if (typeof aVal === 'string') aVal = aVal.toLowerCase()
            if (typeof bVal === 'string') bVal = bVal.toLowerCase()

            // Comparar
            if (aVal < bVal) return -1
            if (aVal > bVal) return 1
            return 0
        })
    }

    return filtered
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProducts.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

onMounted(async () => {
    try {
        const response = await api.get('/products')
        products.value = response.data
    } catch (error) {
        console.error('Error al cargar los productos:', error)
    } finally {
        loading.value = false
    }
})

function openModal(product: Product | null = null) {
    selectedProduct.value = product
    showModal.value = true
}

function updateSort() {
    // Resetear a primera página cuando se cambia el ordenamiento
    currentPage.value = 1
}

async function onProductSaved(updatedProduct: Product) {
    const index = products.value.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
        products.value[index] = updatedProduct
    } else {
        products.value.push(updatedProduct)
    }
    showModal.value = false
    if (index === -1) currentPage.value = 1
}

function askDeleteProduct(product: Product) {
    productToDelete.value = product
    showConfirm.value = true
}

async function deleteAllProduct() {
    if (!productToDelete.value) return
    await deleteProduct(productToDelete.value.id)
    productToDelete.value = null
    showConfirm.value = false
}

async function confirmDelete(quantityToDelete: number) {
    if (!productToDelete.value) return
    const id = productToDelete.value.id
    const stock = productToDelete.value.stock

    if (quantityToDelete >= stock) {
        await deleteProduct(id)
    } else {
        await deleteProductQuantity(id, quantityToDelete)
        const prod = products.value.find(p => p.id === id)
        if (prod) prod.stock -= quantityToDelete
    }
    productToDelete.value = null
    showConfirm.value = false
}

function cancelDelete() {
    productToDelete.value = null
    showConfirm.value = false
}

async function deleteProduct(id: number) {
    try {
        await api.delete(`/products/${id}`)
        products.value = products.value.filter(p => p.id !== id)
    } catch (error) {
        alert('Error al eliminar el producto')
    }
}

async function deleteProductQuantity(id: number, quantity: number) {
    try {
        await api.put(`/products/${id}`, { quantity: quantity })
    } catch (error) {
        alert('Error al eliminar cantidad')
    }
}
</script>
