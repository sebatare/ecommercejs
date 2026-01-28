<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="mb-12">
                <router-link to="/" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-6">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                </router-link>
                <div class="flex items-center gap-6">
                    <div
                        class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {{ userInitials }}
                    </div>
                    <div>
                        <h1 class="text-4xl font-black text-gray-900">{{ userNameCapitalized }}</h1>
                        <p class="text-gray-600 mt-2">{{ auth.user?.email }}</p>
                        <span
                            class="inline-block mt-3 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold uppercase">
                            {{ roleLabel }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="flex gap-2 mb-8 flex-wrap border-b border-gray-200">
                <button v-for="tab in visibleTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'px-6 py-3 font-semibold transition-colors whitespace-nowrap',
                    activeTab === tab.id
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                ]">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-white rounded-2xl shadow-lg p-8">
                <!-- Perfil Tab -->
                <div v-if="activeTab === 'profile'" class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                            <p class="text-gray-900 text-lg">{{ auth.user?.name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <p class="text-gray-900 text-lg">{{ auth.user?.email }}</p>
                        </div>
                    </div>
                    <div class="pt-6 border-t border-gray-200">
                        <button
                            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                            Editar Perfil
                        </button>
                    </div>
                </div>

                <!-- Pedidos Tab (Cliente) -->
                <div v-if="activeTab === 'orders'" class="space-y-4">
                    <div class="grid gap-4">
                        <div v-for="order in mockOrders" :key="order.id"
                            class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="text-sm text-gray-600">Orden #{{ order.id }}</p>
                                    <p class="font-semibold text-gray-900 text-lg mt-1">{{ order.date }}</p>
                                </div>
                                <span :class="[
                                    'px-4 py-2 rounded-full text-sm font-semibold',
                                    order.status === 'completado' ? 'bg-green-100 text-green-700' :
                                        order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                ]">
                                    {{ order.status }}
                                </span>
                            </div>
                            <p class="text-gray-600 mb-3">{{ order.items }} productos - Total: <span
                                    class="font-bold text-gray-900">${{ order.total }}</span></p>
                            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Ver detalles
                                →</button>
                        </div>
                    </div>
                    <div v-if="mockOrders.length === 0" class="text-center py-12 text-gray-500">
                        <p>Aún no tienes pedidos</p>
                    </div>
                </div>

                <!-- Favoritos Tab (Cliente) -->
                <div v-if="activeTab === 'favorites'" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="product in mockFavorites" :key="product.id"
                            class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                            <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
                                <p class="text-indigo-600 font-bold mb-3">${{ product.price }}</p>
                                <button
                                    class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold">
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="mockFavorites.length === 0" class="text-center py-12 text-gray-500">
                        <p>Aún no tienes favoritos</p>
                    </div>
                </div>

                <!-- Configuración Tab -->
                <div v-if="activeTab === 'settings'" class="space-y-8">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 mb-4">Seguridad</h3>
                        <button
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                            Cambiar contraseña
                        </button>
                    </div>
                    <div class="pt-6 border-t border-gray-200">
                        <h3 class="text-lg font-bold text-gray-900 mb-4">Notificaciones</h3>
                        <div class="space-y-4">
                            <label class="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" class="w-4 h-4 rounded" checked>
                                <span class="text-gray-700">Notificaciones por correo sobre pedidos</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" class="w-4 h-4 rounded" checked>
                                <span class="text-gray-700">Ofertas y promociones</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Tab (Admin) -->
                <div v-if="activeTab === 'dashboard'" class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                            <p class="text-blue-600 text-sm font-semibold mb-2">Total Ventas</p>
                            <p class="text-3xl font-bold text-gray-900">$24,580</p>
                            <p class="text-blue-600 text-xs mt-2">+12% este mes</p>
                        </div>
                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                            <p class="text-green-600 text-sm font-semibold mb-2">Productos</p>
                            <p class="text-3xl font-bold text-gray-900">184</p>
                            <p class="text-green-600 text-xs mt-2">24 sin stock</p>
                        </div>
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                            <p class="text-purple-600 text-sm font-semibold mb-2">Órdenes</p>
                            <p class="text-3xl font-bold text-gray-900">328</p>
                            <p class="text-purple-600 text-xs mt-2">12 pendientes</p>
                        </div>
                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                            <p class="text-orange-600 text-sm font-semibold mb-2">Usuarios</p>
                            <p class="text-3xl font-bold text-gray-900">1,429</p>
                            <p class="text-orange-600 text-xs mt-2">+48 nuevos</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <router-link to="/admin/products"
                            class="block p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">Gestionar Productos</h3>
                            <p class="text-gray-600 text-sm mb-4">Crear, editar, eliminar y actualizar stock</p>
                            <span class="text-indigo-600 font-semibold">Ir →</span>
                        </router-link>
                        <router-link to="/admin/users"
                            class="block p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">Gestionar Usuarios</h3>
                            <p class="text-gray-600 text-sm mb-4">Ver, editar roles y permisos</p>
                            <span class="text-indigo-600 font-semibold">Ir →</span>
                        </router-link>
                    </div>
                </div>

                <!-- Estadísticas Tab (Admin) -->
                <div v-if="activeTab === 'stats'" class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="border border-gray-200 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-gray-900 mb-4">Top Productos</h3>
                            <div class="space-y-3">
                                <div v-for="product in mockTopProducts" :key="product.id"
                                    class="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                                    <span class="text-gray-700">{{ product.name }}</span>
                                    <span class="font-bold text-gray-900">{{ product.sales }} ventas</span>
                                </div>
                            </div>
                        </div>
                        <div class="border border-gray-200 rounded-xl p-6">
                            <h3 class="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
                            <div class="space-y-3">
                                <div v-for="activity in mockActivity" :key="activity.id"
                                    class="pb-3 border-b border-gray-100 last:border-0">
                                    <p class="text-sm text-gray-600">{{ activity.action }}</p>
                                    <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../store/auth'

const auth = useAuthStore()
const activeTab = ref('profile')

const tabs = [
    { id: 'profile', label: 'Perfil' },
    { id: 'orders', label: 'Pedidos', adminOnly: false },
    { id: 'favorites', label: 'Favoritos', adminOnly: false },
    { id: 'settings', label: 'Configuración' },
    { id: 'dashboard', label: 'Dashboard', adminOnly: true },
    { id: 'stats', label: 'Estadísticas', adminOnly: true },
]

const visibleTabs = computed(() => {
    if (auth.user?.role === 'admin') {
        return tabs
    }
    return tabs.filter(tab => !tab.adminOnly)
})

const userNameCapitalized = computed(() => {
    return auth.user?.name
        ? auth.user.name.charAt(0).toUpperCase() + auth.user.name.slice(1)
        : ''
})

const userInitials = computed(() => {
    const name = auth.user?.name || ''
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

const roleLabel = computed(() => {
    return auth.user?.role === 'admin' ? 'Administrador' : 'Cliente'
})

// Mock data
const mockOrders = [
    { id: 1001, date: '2025-12-15', status: 'completado', items: 3, total: '89.99' },
    { id: 1002, date: '2025-12-10', status: 'pendiente', items: 2, total: '54.50' },
    { id: 1003, date: '2025-12-05', status: 'en tránsito', items: 1, total: '32.00' },
]

const mockFavorites = [
    { id: 1, name: 'Auriculares Pro', price: '129.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { id: 2, name: 'Smartphone X12', price: '899.99', image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80' },
    { id: 3, name: 'Smartwatch', price: '299.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
]

const mockTopProducts = [
    { id: 1, name: 'Auriculares Pro', sales: 342 },
    { id: 2, name: 'Funda iPhone', sales: 298 },
    { id: 3, name: 'Cable USB-C', sales: 267 },
    { id: 4, name: 'Power Bank', sales: 189 },
]

const mockActivity = [
    { id: 1, action: 'Nuevo pedido de Juan García', time: 'Hace 2 horas' },
    { id: 2, action: 'Stock bajo: Auriculares Pro (5 unidades)', time: 'Hace 5 horas' },
    { id: 3, action: 'Nuevo usuario registrado', time: 'Hace 1 día' },
    { id: 4, action: 'Producto eliminado: Cable defectuoso', time: 'Hace 2 días' },
]
</script>

<style scoped>
/* Animations */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

[class*="activeTab"] {
    animation: slideIn 0.3s ease-out;
}
</style>
