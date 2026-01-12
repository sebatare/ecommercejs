 <template>
    <h1>Panel de administración de productos</h1>
    <p>En esta sección puedes gestionar los productos de tu tienda.</p>
    <div v-if="loading">Cargando productos...</div>
    <div v-else-if="products.length === 0">No hay productos disponibles.</div>
    <div class="actions">
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre..." class="search-input" />
        <button @click="openModal()" class="add-button">Agregar producto</button>
    </div>


    <!-- Tabla de productos -->
    <div class="product-table">
        <table>
            <thead>
                <tr>
                    <th @click="toggleSort('id')">
                        ID <span class="sort-icon" :class="{ active: sortKey === 'id' }">{{ sortOrder === 'asc' ?
                            '▲' : '▼' }}</span>
                    </th>
                    <th @click="toggleSort('name')">
                        Nombre <span class="sort-icon" :class="{ active: sortKey === 'name' }">{{ sortOrder ===
                            'asc' ? '▲' : '▼' }}</span>
                    </th>
                    <th @click="toggleSort('price')">
                        Precio <span class="sort-icon" :class="{ active: sortKey === 'price' }">{{ sortOrder ===
                            'asc' ? '▲' : '▼' }}</span>
                    </th>
                    <th @click="toggleSort('stock')">
                        Stock <span class="sort-icon" :class="{ active: sortKey === 'stock' }">{{ sortOrder ===
                            'asc' ? '▲' : '▼' }}</span>
                    </th>
                    <th @click="toggleSort('categories')">
                        Categoría <span class="sort-icon" :class="{ active: sortKey === 'categories' }">{{ sortOrder
                            === 'asc' ? '▲' : '▼' }}</span>
                    </th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                    <td>{{ product.stock }}</td>
                    <td>
                        <span v-for="(cat, index) in product.categories" :key="index" class="category-badge">
                            {{ cat.name }}
                        </span>
                    </td>
                    <td>
                        <button @click="openModal(product)">Editar</button>
                        <button @click="askDeleteProduct(product)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Controles de paginación -->
        <div class="pagination">
            <button :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="currentPage++">Siguiente</button>
        </div>
    </div>

    <ProductFormModal v-if="showModal" :product="selectedProduct" @close="showModal = false" @saved="onProductSaved" />
    <ConfirmDialog v-if="showConfirm" :message="`¿Seguro que deseas eliminar este producto?`" :showQuantityInput="true"
        :maxStock="productToDelete?.stock" @confirm="confirmDelete" @deleteAll="deleteAllProduct"
        @cancel="cancelDelete" />
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
const sortKey = ref('id')
const sortOrder = ref<'asc' | 'desc'>('asc')
const itemsPerPage = 20
const currentPage = ref(1)
const showModal = ref(false)
const selectedProduct: Ref<Product | null> = ref(null)
const showConfirm = ref(false)
const productToDelete: Ref<Product | null> = ref(null)

const filteredProducts = computed(() => {
    const filtered = products.value.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    return filtered.sort((a, b) => {
        let aValue: any = a[sortKey.value as keyof typeof a]
        let bValue: any = b[sortKey.value as keyof typeof b]

        if (sortKey.value === 'categories') {
            aValue = a.categories[0]?.name || ''
            bValue = b.categories[0]?.name || ''
        }

        if (typeof aValue === 'string') aValue = aValue.toLowerCase()
        if (typeof bValue === 'string') bValue = bValue.toLowerCase()

        if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
        return 0
    })
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

function toggleSort(key: string) {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = 'asc'
    }
}

function openModal(product: Product | null = null) {
    selectedProduct.value = product
    showModal.value = true
}

async function onProductSaved(updatedProduct: Product) {
    // 1. Verificar si el producto ya existe en la lista local
    const index = products.value.findIndex(p => p.id === updatedProduct.id);

    if (index !== -1) {
        // 2. Si existe, lo actualizamos localmente
        products.value[index] = updatedProduct;
    } else {
        // 3. Si es un producto nuevo, lo agregamos al final de la lista
        products.value.push(updatedProduct);
    }
    
    showModal.value = false;
    
    // Opcional: Volver a la primera página si se agregó un nuevo producto
    if (index === -1) {
        currentPage.value = 1;
    }
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
        // Actualiza el stock localmente
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

// Lógica de eliminación unificada
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
        // Actualizar localmente si la API devuelve el producto actualizado
        // const response = await api.put(...)
        // const updatedProduct = response.data;
        // const index = products.value.findIndex(p => p.id === updatedProduct.id);
        // if (index !== -1) {
        //     products.value[index] = updatedProduct;
        // }
    } catch (error) {
        alert('Error al eliminar cantidad')
    }
}
</script>

<style scoped>
.sort-icon {
    font-size: 12px;
    margin-left: 4px;
    opacity: 0.3;
}

.sort-icon.active {
    opacity: 1;
}


.pagination {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
}

.pagination button {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    background-color: #2196f3;
    color: white;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.search-input {
    padding: 8px 12px;
    font-size: 14px;
    width: 60%;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.add-button {
    background-color: #005296;
    color: white;
    border: none;
    padding: 8px 16px;
    font-weight: 600;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.add-button:hover {
    background-color: #1976d2;
}

.category-badge {
    background-color: #e0f2f1;
    color: #00796b;
    padding: 4px 8px;
    margin-right: 4px;
    border-radius: 4px;
    font-size: 12px;
}

.product-table {
    overflow-x: auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    color: var(--text-color, #333);
    overflow: auto;
    max-height: 750px;
}

h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

p {
    margin-bottom: 20px;
    color: #555;
}


table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

th,
td {
    padding: 12px 16px;
    text-align: left;
}

th {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
}

th span {
    font-size: 12px;
    margin-left: 4px;
}

tr:nth-child(even) {
    background-color: #fafafa;
}

tr:hover {
    background-color: #f0f0f0;
}

button {
    padding: 6px 12px;
    margin-right: 6px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease;
}

button:hover {
    opacity: 0.9;
}
</style>
