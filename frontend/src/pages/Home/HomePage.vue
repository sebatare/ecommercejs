<template>
    <div class="home-page">
        <header class="header-filtros">
            <h1>Explora nuestros productos</h1>
            <div class="filtros">
                <label for="categoria">Categoría:</label>
                <select id="categoria" v-model="categoriaSeleccionada">
                    <option value="">Todas</option>
                    <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                        {{ categoria.name }}
                    </option>
                </select>
            </div>
        </header>

        <div class="productos-grid">
            <div class="producto-card" v-for="producto in productosPaginados" :key="producto.id">

                <h2>{{ producto.name }}</h2>
                <p class="desc">{{ producto.description }}</p>
                <p class="precio">${{ producto.price }}</p>
                <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
            </div>
        </div>
        <div class="paginacion">
            <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">Anterior</button>

            <button v-for="pagina in paginasVisibles" :key="pagina" :class="{ activa: pagina === paginaActual }"
                @click="typeof pagina === 'number' && cambiarPagina(pagina)" :disabled="pagina === '...'">
                {{ pagina }}
            </button>

            <button @click="cambiarPagina(paginaActual + 1)"
                :disabled="paginaActual === totalPaginas">Siguiente</button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import api from '../../utils/axios'
import type { Product, Category } from '../../types/index'
import { useCartStore } from '../../store/cart'
console.log('HomePage script setup loaded')

const products = ref<Product[]>([])
const categorias = ref<Category[]>([])
const categoriaSeleccionada = ref<string | number>('')

const cart = useCartStore()

const paginaActual = ref(1)
const productosPorPagina = 9

const totalPaginas = computed(() =>
    Math.ceil(productosFiltrados.value.length / productosPorPagina)
)

const productosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * productosPorPagina
    return productosFiltrados.value.slice(inicio, inicio + productosPorPagina)
})
const paginasVisibles = computed(() => {
    const total = totalPaginas.value
    const actual = paginaActual.value
    const rango = 2
    const paginas: (number | '...')[] = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) paginas.push(i)
    } else {
        paginas.push(1)
        if (actual > rango + 2) paginas.push('...')
        for (let i = Math.max(2, actual - rango); i <= Math.min(total - 1, actual + rango); i++) {
            paginas.push(i)
        }
        if (actual < total - rango - 1) paginas.push('...')
        paginas.push(total)
    }

    return paginas
})

const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
        paginaActual.value = nuevaPagina
    }
}


onMounted(async () => {
    console.log('HomePage mounted') // <-- Agrega esto
    try {
        const { data } = await api.get<Product[]>('/products')
        console.log('Productos recibidos:', data) // <-- Y esto
        products.value = data

        const categoriasUnicas: Record<number, Category> = {}
        data.forEach((producto) => {
            producto.categories.forEach((cat) => {
                categoriasUnicas[cat.id] = cat
            })
        })
        categorias.value = Object.values(categoriasUnicas)
    } catch (e) {
        console.error('Error al cargar productos:', e)
    }
})

const productosFiltrados = computed(() => {
    if (!categoriaSeleccionada.value) return products.value
    return products.value.filter((producto) =>
        producto.categories.some((cat) => cat.id === Number(categoriaSeleccionada.value))
    )
})

const agregarAlCarrito = (producto: Product) => {
    cart.agregar(producto)
}
</script>

<style scoped>
.home-page {
    padding: 2rem;
}

.header-filtros {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background-color: rgba(255, 255, 255, 0.04);
    padding: 1rem 2rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
    box-shadow: var(--box-shadow);
}

.header-filtros h1 {
    margin: 0;
    font-size: 2.5rem;
}

.filtros {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.filtros label {
    font-size: 1.1rem;
    font-weight: 500;
}

.filtros select {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    transition: border-color 0.2s ease;
    min-width: 160px;
}

.filtros select:focus {
    outline: none;
    color: white;
    background-color: rgb(58, 58, 58);
}

.producto-card h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.producto-card .desc {
    font-size: 0.95rem;
    opacity: 0.9;
    margin-bottom: 1rem;
}

.producto-card .precio {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--color-success);
}

.paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.paginacion button {
    padding: 0.4rem 0.8rem;
    font-weight: bold;
    background-color: var(--color-primary, #007bff);
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    min-width: 40px;
}

.paginacion button:disabled {
    background-color: #999;
    cursor: not-allowed;
}

.paginacion button.activa {
    background-color: #0056b3;
}

.paginacion span {
    font-size: 1rem;
}
</style>
