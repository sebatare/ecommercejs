<template>
    <div class="min-h-screen transition-colors duration-300" :style="{ backgroundColor: 'var(--color-bg)' }">
        <!-- Hero Section -->
        <div class="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8" :style="{
            background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`
        }">
            <div class="max-w-4xl mx-auto text-center text-white">
                <h1 class="text-4xl sm:text-5xl font-bold mb-4">Panel de Administración</h1>
                <p class="text-xl sm:text-2xl opacity-90">Bienvenido. Gestiona todos los aspectos de tu tienda desde
                    aquí.</p>
            </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 class="text-2xl font-bold mb-8" :style="{ color: 'var(--color-primary)' }">
                Acciones Rápidas
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <!-- Gestionar Productos -->
                <router-link to="/admin/products" class="group">
                    <div class="card hover:shadow-xl transition-all duration-300 h-full cursor-pointer"
                        :style="{ borderLeft: `4px solid var(--color-primary)` }">
                        <div class="text-4xl mb-4">📦</div>
                        <h3 class="font-bold text-lg mb-2" :style="{ color: 'var(--color-primary)' }">
                            Productos
                        </h3>
                        <p class="text-sm opacity-75">Gestiona tu catálogo de productos</p>
                        <p class="text-2xl font-bold mt-4">284</p>
                    </div>
                </router-link>

                <!-- Gestionar Usuarios -->
                <router-link to="/admin/users" class="group">
                    <div class="card hover:shadow-xl transition-all duration-300 h-full cursor-pointer"
                        :style="{ borderLeft: `4px solid var(--color-success)` }">
                        <div class="text-4xl mb-4">👥</div>
                        <h3 class="font-bold text-lg mb-2" :style="{ color: 'var(--color-success)' }">
                            Usuarios
                        </h3>
                        <p class="text-sm opacity-75">Administra usuarios y permisos</p>
                        <p class="text-2xl font-bold mt-4">1,248</p>
                    </div>
                </router-link>

                <!-- Gestionar Roles -->
                <router-link to="/admin/roles" class="group">
                    <div class="card hover:shadow-xl transition-all duration-300 h-full cursor-pointer"
                        :style="{ borderLeft: `4px solid var(--color-warning)` }">
                        <div class="text-4xl mb-4">🔐</div>
                        <h3 class="font-bold text-lg mb-2" :style="{ color: 'var(--color-warning)' }">
                            Roles
                        </h3>
                        <p class="text-sm opacity-75">Configura roles y permisos</p>
                        <p class="text-2xl font-bold mt-4">8</p>
                    </div>
                </router-link>
            </div>

            <!-- Stats Section -->
            <div class="mt-16">
                <h2 class="text-2xl font-bold mb-8" :style="{ color: 'var(--color-primary)' }">
                    Resumen General
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total Ventas -->
                    <div class="card" :style="{ borderTop: `4px solid var(--color-success)` }">
                        <p class="text-sm font-semibold opacity-75 mb-2">Total Ventas</p>
                        <p class="text-3xl font-bold" :style="{ color: 'var(--color-success)' }">$45,230</p>
                        <p class="text-xs mt-3" :style="{ color: 'var(--color-success)' }">+15% vs mes anterior</p>
                    </div>

                    <!-- Órdenes Pendientes -->
                    <div class="card" :style="{ borderTop: `4px solid var(--color-warning)` }">
                        <p class="text-sm font-semibold opacity-75 mb-2">Órdenes Pendientes</p>
                        <p class="text-3xl font-bold" :style="{ color: 'var(--color-warning)' }">18</p>
                        <p class="text-xs mt-3" :style="{ color: 'var(--color-warning)' }">Requieren atención</p>
                    </div>

                    <!-- Productos sin Stock -->
                    <div class="card" :style="{ borderTop: `4px solid var(--color-danger)` }">
                        <p class="text-sm font-semibold opacity-75 mb-2">Sin Stock</p>
                        <p class="text-3xl font-bold" :style="{ color: 'var(--color-danger)' }">32</p>
                        <p class="text-xs mt-3" :style="{ color: 'var(--color-danger)' }">Productos agotados</p>
                    </div>

                    <!-- Nuevos Usuarios -->
                    <div class="card" :style="{ borderTop: `4px solid var(--color-info)` }">
                        <p class="text-sm font-semibold opacity-75 mb-2">Nuevos Usuarios</p>
                        <p class="text-3xl font-bold" :style="{ color: 'var(--color-info)' }">89</p>
                        <p class="text-xs mt-3" :style="{ color: 'var(--color-info)' }">Este mes</p>
                    </div>
                </div>
            </div>

            <!-- Tips Section -->
            <div class="mt-16 p-8 rounded-lg" :style="{
                backgroundColor: 'var(--color-bg-light)',
                borderLeft: `4px solid var(--color-primary)`
            }">
                <h3 class="text-lg font-bold mb-4" :style="{ color: 'var(--color-primary)' }">💡 Consejos</h3>
                <ul class="space-y-2 text-sm">
                    <li>✓ Revisa regularmente los productos sin stock para evitar decepciones de clientes</li>
                    <li>✓ Procesa las órdenes pendientes lo antes posible</li>
                    <li>✓ Mantén actualizada la información de usuarios y roles</li>
                    <li>✓ Personaliza los temas para que coincida con tu marca</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.card {
    padding: 1.5rem;
    border-radius: 0.75rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    transition: all var(--transition-base);
    color: var(--color-text);
}

.card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

a {
    text-decoration: none;
    color: inherit;
}

a .card {
    display: flex;
    flex-direction: column;
}
</style>
