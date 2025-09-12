<template>
    <div class="home-page">
        <div class="carrousel-sales">
            <ul>
                <li>¡Envío gratis en compras superiores a $50!</li>
                <li>¡Descuentos exclusivos por tiempo limitado!</li>
                <li>¡Nuevos productos añadidos semanalmente!</li>
                <li>¡Suscríbete a nuestro boletín y obtén un 10% de descuento!</li>
                <li>¡Compra ahora y paga en 3 cuotas sin interés!</li>
            </ul>
        </div>

        <div class="carousel-container">
            <Transition name="fade" mode="out-in">
                <div v-if="currentProductOnSale" :key="currentProductOnSale.id" class="carousel-slide"
                    :style="{ backgroundImage: `url(${currentProductOnSale.imageUrl})` }">
                    <div class="overlay">
                        <div class="product-info">
                            <h2>{{ currentProductOnSale.name }}</h2>
                            <p class="price-old">${{ currentProductOnSale.price }}</p>
                            <p class="price-new">${{ discountedPrice }}</p>
                            <p class="discount-percentage">{{ currentProductOnSale.discount_percentage }}% de descuento
                            </p>
                            <button class="buy-button" @click="agregarAlCarrito(currentProductOnSale)">Comprar
                                ahora</button>
                        </div>
                    </div>
                </div>
            </Transition>
            <button @click="prevProduct" class="nav-button prev">❮</button>
            <button @click="nextProduct" class="nav-button next">❯</button>
        </div>
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
import { onMounted, ref, computed, onUnmounted } from 'vue'
import api from '../../utils/api-public'
import type { Product, Category } from '../../types/index'
import { useCartStore } from '../../store/cart'

console.log('HomePage script setup loaded')

// Productos en oferta de ejemplo para desarrollo
const sampleProductsOnSale: Product[] = [
    {
        id: 1,
        name: 'Refrigerador Samsung',
        description: 'Refrigerador de doble puerta con tecnología SpaceMax.',
        price: 999.99,
        discount_percentage: 25,
        imageUrl: 'https://newark.cl/storage/2021/12/Refrigerador-Samsung-rt43k6231-.jpeg',
        categories: [{ id: 1, name: 'Electrodomésticos' }],
        createdAt: new Date().toISOString(),
        stock: 10
    },
    {
        id: 2,
        name: 'Laptop Gamer Asus',
        description: 'Potente laptop para gaming con RTX 3080.',
        price: 1800.00,
        discount_percentage: 15,
        imageUrl: 'https://a-static.besthdwallpaper.com/asus-rog-republic-of-gamers-rog-strix-hero-gaming-laptop-wallpaper-2880x1800-63835_8.jpg',
        categories: [{ id: 2, name: 'Computación' }],
        createdAt: new Date().toISOString(),
        stock: 5
    },
    {
        id: 3,
        name: 'Smart TV LG 55"',
        description: 'Televisor OLED con resolución 4K.',
        price: 1250.00,
        discount_percentage: 20,
        imageUrl: 'https://i.blogs.es/e3c27e/lgoled22_z2_oled/1366_2000.jpeg',
        categories: [{ id: 1, name: 'Electrodomésticos' }],
        createdAt: new Date().toISOString(),
        stock: 8
    },
    {
        id: 4,
        name: 'Smartphone Pixel 7',
        description: 'El nuevo teléfono de Google con cámara de alta calidad.',
        price: 700.00,
        discount_percentage: 10,
        imageUrl: 'https://phantom.telekom.es/f8ac863e46c986c4f2ac49e25e98f7e2/6920f3e6c0c2f82c23c6d5951c2ac4d2/PIXEL_7_PRO_Obsidian_Front.jpg',
        categories: [{ id: 3, name: 'Smartphones' }],
        createdAt: new Date().toISOString(),
        stock: 15
    },
    {
        id: 5,
        name: 'Auriculares Sony WH-1000XM5',
        description: 'Cancelación de ruido líder en la industria.',
        price: 350.00,
        discount_percentage: 5,
        imageUrl: 'https://hi-fi.com.ua/image/cache/catalog/hi-fi-com-ua/Sony/Sony_WH-1000XM5/Sony_WH-1000XM5_1-750x750.jpeg',
        categories: [{ id: 4, name: 'Audio' }],
        createdAt: new Date().toISOString(),
        stock: 20
    }
]

const products = ref<Product[]>([])
const categorias = ref<Category[]>([])
const categoriaSeleccionada = ref<string | number>('')

const productsOnSale = ref<Product[]>([])
const currentSlideIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | undefined

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

const currentProductOnSale = computed(() => {
    if (productsOnSale.value.length === 0) return null
    return productsOnSale.value[currentSlideIndex.value]
})

const discountedPrice = computed(() => {
    if (!currentProductOnSale.value) return 0
    const price = currentProductOnSale.value.price
    const discount = currentProductOnSale.value.discount_percentage
    return (price - (price * discount / 100)).toFixed(2)
})

const nextProduct = () => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % productsOnSale.value.length
}

const prevProduct = () => {
    currentSlideIndex.value = (currentSlideIndex.value - 1 + productsOnSale.value.length) % productsOnSale.value.length
}

const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
        paginaActual.value = nuevaPagina
    }
}

onMounted(async () => {
    console.log('HomePage mounted')
    try {
        const { data } = await api.get<Product[]>('/products')
        console.log('Productos recibidos:', data)
        products.value = data

        const categoriasUnicas: Record<number, Category> = {}
        data.forEach((producto) => {
            producto.categories.forEach((cat) => {
                categoriasUnicas[cat.id] = cat
            })
        })
        categorias.value = Object.values(categoriasUnicas)

        // Asignamos los productos de ejemplo para el carrusel
        productsOnSale.value = sampleProductsOnSale

        if (productsOnSale.value.length > 1) {
            intervalId = setInterval(nextProduct, 5000)
        }

    } catch (e) {
        console.error('Error al cargar productos:', e)
    }
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
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

.carrousel-sales {
    background-color: #333;
    color: white;
    padding: 0.5rem;
    text-align: center;
    overflow: hidden;
    position: relative;
    white-space: nowrap;
    margin-bottom: 2rem;
}

.carrousel-sales ul {
    display: inline-block;
    animation: marquee 20s linear infinite;
    padding: 0;
    margin: 0;
}

.carrousel-sales li {
    display: inline-block;
    padding: 0 2rem;
    font-weight: 500;
}

@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

.carousel-container {
    position: relative;
    width: 100vw;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    height: 400px;
    overflow: hidden;
    margin-bottom: 2rem;
}

.carousel-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: background-image 0.8s ease-in-out;
}

.overlay {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
    text-align: center;
}

.product-info {
    padding: 2rem;
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.product-info h2 {
    font-size: 3rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.price-old {
    font-size: 1.5rem;
    text-decoration: line-through;
    color: #ccc;
    margin: 0.5rem 0;
}

.price-new {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-success);
    margin: 0.5rem 0;
}

.discount-percentage {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--color-danger);
    background-color: rgba(255, 0, 0, 0.8);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    display: inline-block;
}

.buy-button {
    margin-top: 1.5rem;
    padding: 0.8rem 2rem;
    font-size: 1.2rem;
    background-color: var(--color-primary);
    border: none;
    color: white;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.buy-button:hover {
    background-color: #0056b3;
}

.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    font-size: 2rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    z-index: 10;
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

.nav-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
}

.nav-button.prev {
    left: 2rem;
}

.nav-button.next {
    right: 2rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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

@media (max-width: 768px) {
    .carousel-container {
        width: 100%;
        left: auto;
        right: auto;
        margin-left: 0;
        margin-right: 0;
        height: 300px;
    }

    .nav-button.prev {
        left: 0.5rem;
    }

    .nav-button.next {
        right: 0.5rem;
    }
}
</style>