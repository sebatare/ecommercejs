<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-12">
                <h1
                    class="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Panel de Administración
                </h1>
                <p class="text-gray-600 text-lg">Bienvenido. Gestiona todos los aspectos de tu tienda desde aquí.</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div @click="selectedChart = 'sales'"
                    class="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                    <div class="text-blue-600 text-4xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                    <p class="text-gray-600 text-sm font-semibold mb-2">Total Ventas</p>
                    <p class="text-3xl font-bold text-gray-900">$45,230</p>
                    <p class="text-blue-600 text-xs mt-2">+15% vs mes anterior</p>
                </div>

                <div @click="selectedChart = 'products'"
                    class="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                    <div class="text-green-600 text-4xl mb-2 group-hover:scale-110 transition-transform">📦</div>
                    <p class="text-gray-600 text-sm font-semibold mb-2">Productos</p>
                    <p class="text-3xl font-bold text-gray-900">284</p>
                    <p class="text-green-600 text-xs mt-2">32 sin stock</p>
                </div>

                <div @click="selectedChart = 'users'"
                    class="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                    <div class="text-purple-600 text-4xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                    <p class="text-gray-600 text-sm font-semibold mb-2">Usuarios</p>
                    <p class="text-3xl font-bold text-gray-900">1,248</p>
                    <p class="text-purple-600 text-xs mt-2">+89 nuevos</p>
                </div>

                <div @click="selectedChart = 'orders'"
                    class="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                    <div class="text-orange-600 text-4xl mb-2 group-hover:scale-110 transition-transform">🛒</div>
                    <p class="text-gray-600 text-sm font-semibold mb-2">Órdenes</p>
                    <p class="text-3xl font-bold text-gray-900">542</p>
                    <p class="text-orange-600 text-xs mt-2">18 pendientes</p>
                </div>
            </div>

            <!-- Charts Modal -->
            <div v-if="selectedChart"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96">
                    <div class="flex justify-between items-center p-6 border-b border-gray-200">
                        <h3 class="text-xl font-bold text-gray-900">{{ getChartTitle() }}</h3>
                        <button @click="selectedChart = null"
                            class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                    </div>
                    <div class="p-6">
                        <div v-if="selectedChart === 'sales'" class="space-y-4">
                            <div class="text-center mb-4">
                                <div class="text-6xl font-bold text-blue-600">$45,230</div>
                                <p class="text-gray-600 mt-2">+15% comparado al mes anterior</p>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-4">
                                    <span class="w-24 text-gray-600">Ene</span>
                                    <div class="flex-1 bg-blue-100 rounded h-2" style="width: 60%"></div>
                                    <span class="text-gray-700 font-semibold">$32,000</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-24 text-gray-600">Feb</span>
                                    <div class="flex-1 bg-blue-200 rounded h-2" style="width: 75%"></div>
                                    <span class="text-gray-700 font-semibold">$39,000</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-24 text-gray-600">Mar</span>
                                    <div class="flex-1 bg-blue-600 rounded h-2" style="width: 100%"></div>
                                    <span class="text-gray-700 font-semibold">$45,230</span>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="selectedChart === 'products'" class="space-y-4">
                            <div class="text-center mb-4">
                                <div class="text-6xl font-bold text-green-600">284</div>
                                <p class="text-gray-600 mt-2">Productos en inventario</p>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-4">
                                    <span class="w-32 text-gray-600">En Stock</span>
                                    <div class="flex-1 bg-green-500 rounded h-3"></div>
                                    <span class="text-gray-700 font-semibold">252</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-32 text-gray-600">Stock Bajo</span>
                                    <div class="flex-1 bg-yellow-400 rounded h-3" style="width: 11%"></div>
                                    <span class="text-gray-700 font-semibold">32</span>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="selectedChart === 'users'" class="space-y-4">
                            <div class="text-center mb-4">
                                <div class="text-6xl font-bold text-purple-600">1,248</div>
                                <p class="text-gray-600 mt-2">Usuarios registrados</p>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-4">
                                    <span class="w-24 text-gray-600">Ene</span>
                                    <div class="flex-1 bg-purple-200 rounded h-2" style="width: 65%"></div>
                                    <span class="text-gray-700 font-semibold">810</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-24 text-gray-600">Feb</span>
                                    <div class="flex-1 bg-purple-400 rounded h-2" style="width: 85%"></div>
                                    <span class="text-gray-700 font-semibold">1,059</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-24 text-gray-600">Mar</span>
                                    <div class="flex-1 bg-purple-600 rounded h-2" style="width: 100%"></div>
                                    <span class="text-gray-700 font-semibold">1,248</span>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="selectedChart === 'orders'" class="space-y-4">
                            <div class="text-center mb-4">
                                <div class="text-6xl font-bold text-orange-600">542</div>
                                <p class="text-gray-600 mt-2">Órdenes totales</p>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-4">
                                    <span class="w-32 text-gray-600">Completadas</span>
                                    <div class="flex-1 bg-green-500 rounded h-3" style="width: 85%"></div>
                                    <span class="text-gray-700 font-semibold">461</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-32 text-gray-600">Pendientes</span>
                                    <div class="flex-1 bg-orange-400 rounded h-3" style="width: 3%"></div>
                                    <span class="text-gray-700 font-semibold">18</span>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="w-32 text-gray-600">Canceladas</span>
                                    <div class="flex-1 bg-red-400 rounded h-3" style="width: 5%"></div>
                                    <span class="text-gray-700 font-semibold">63</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Admin Actions Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <router-link to="/admin/products"
                    class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all group cursor-pointer">
                    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Productos</h3>
                    <p class="text-gray-600 text-sm mb-4">Crear, editar, eliminar productos y actualizar stock</p>
                    <span class="text-indigo-600 font-semibold group-hover:text-indigo-800">Ir →</span>
                </router-link>

                <router-link to="/admin/users"
                    class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all group cursor-pointer">
                    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Usuarios</h3>
                    <p class="text-gray-600 text-sm mb-4">Ver, editar y asignar roles a usuarios</p>
                    <span class="text-indigo-600 font-semibold group-hover:text-indigo-800">Ir →</span>
                </router-link>

                <router-link to="/admin/roles"
                    class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all group cursor-pointer">
                    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">🔐</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Roles</h3>
                    <p class="text-gray-600 text-sm mb-4">Crear y configurar permisos para roles</p>
                    <span class="text-indigo-600 font-semibold group-hover:text-indigo-800">Ir →</span>
                </router-link>

                <div
                    class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all group cursor-not-allowed opacity-60">
                    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Categorías</h3>
                    <p class="text-gray-600 text-sm mb-4">Próxamente disponible</p>
                    <span class="text-gray-400 font-semibold">Próximamente</span>
                </div>

                <div
                    class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all group cursor-not-allowed opacity-60">
                    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Pedidos</h3>
                    <p class="text-gray-600 text-sm mb-4">Próxamente disponible</p>
                    <span class="text-gray-400 font-semibold">Próximamente</span>
                </div>

                <div
                    class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all group cursor-not-allowed opacity-60">
                    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gestionar Carritos</h3>
                    <p class="text-gray-600 text-sm mb-4">Próxamente disponible</p>
                    <span class="text-gray-400 font-semibold">Próximamente</span>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="mt-12 bg-white rounded-2xl shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
                <div class="space-y-4">
                    <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p class="text-gray-700"><strong>Juan García</strong> realizó un pedido de $234.50</p>
                        <p class="text-gray-500 text-sm ml-auto">Hace 2 horas</p>
                    </div>
                    <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
                        <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p class="text-gray-700">Stock bajo en <strong>Auriculares Pro</strong> (3 unidades)</p>
                        <p class="text-gray-500 text-sm ml-auto">Hace 5 horas</p>
                    </div>
                    <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p class="text-gray-700"><strong>5 nuevos usuarios</strong> se registraron</p>
                        <p class="text-gray-500 text-sm ml-auto">Hace 1 día</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedChart = ref<'sales' | 'products' | 'users' | 'orders' | null>(null)

const getChartTitle = (): string => {
    const titles: Record<string, string> = {
        sales: 'Ventas del Trimestre',
        products: 'Inventario de Productos',
        users: 'Crecimiento de Usuarios',
        orders: 'Estado de Órdenes'
    }
    return titles[selectedChart.value as string] || ''
}
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

* {
    animation: fadeIn 0.3s ease-out;
}
</style>