<template>
    <div class="admin-page">
        <div class="max-w-7xl mx-auto">

            <!-- Header -->
            <div class="mb-12">
                <h1 class="text-5xl font-black mb-2 gradient-title">
                    Panel de Administración
                </h1>
                <p class="text-lg text-muted">
                    Bienvenido. Gestiona todos los aspectos de tu tienda desde aquí.
                </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div v-for="card in stats" :key="card.key" @click="selectedChart = card.key as Chart" class="stat-card"
                    :class="card.border">
                    <div class="text-4xl mb-2">{{ card.icon }}</div>
                    <p class="text-sm font-semibold text-muted">{{ card.label }}</p>
                    <p class="text-3xl font-bold" :class="card.color">{{ card.value }}</p>
                    <p class="text-xs mt-2" :class="card.color">{{ card.note }}</p>
                </div>
            </div>

            <!-- Modal -->
            <div v-if="selectedChart" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="card max-w-2xl w-full">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">{{ getChartTitle() }}</h3>
                        <button @click="selectedChart = null">✕</button>
                    </div>
                    <p class="text-muted text-center">
                        Aquí iría el gráfico real (API).
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Chart = 'sales' | 'products' | 'users' | 'orders'

const selectedChart = ref<Chart | null>(null)

const stats = [
    {
        key: 'sales',
        icon: '📊',
        label: 'Total Ventas',
        value: '$45,230',
        note: '+15% vs mes anterior',
        color: 'text-info',
        border: 'border-info'
    },
    {
        key: 'products',
        icon: '📦',
        label: 'Productos',
        value: '284',
        note: '32 sin stock',
        color: 'text-success',
        border: 'border-success'
    },
    {
        key: 'users',
        icon: '👥',
        label: 'Usuarios',
        value: '1,248',
        note: '+89 nuevos',
        color: 'text-primary',
        border: 'border-primary'
    },
    {
        key: 'orders',
        icon: '🛒',
        label: 'Órdenes',
        value: '542',
        note: '18 pendientes',
        color: 'text-warning',
        border: 'border-warning'
    }
]

const getChartTitle = () =>
({
    sales: 'Ventas',
    products: 'Productos',
    users: 'Usuarios',
    orders: 'Órdenes'
}[selectedChart.value!])
</script>

<style scoped>
.admin-page {
    min-height: 100vh;
    padding: 3rem 1rem;
    background: var(--color-bg-dark);
}

.stat-card {
    background: var(--color-bg);
    border-left: 4px solid;
    border-radius: 1rem;
    padding: 2rem;
    cursor: pointer;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: scale(1.05);
}

.card {
    background: var(--color-bg);
    border-radius: 1rem;
    padding: 2rem;
}

.text-muted {
    color: var(--color-text-light);
}

.text-info {
    color: var(--color-info);
}

.text-success {
    color: var(--color-success);
}

.text-primary {
    color: var(--color-primary);
}

.text-warning {
    color: var(--color-warning);
}

.border-info {
    border-color: var(--color-info);
}

.border-success {
    border-color: var(--color-success);
}

.border-primary {
    border-color: var(--color-primary);
}

.border-warning {
    border-color: var(--color-warning);
}

.gradient-title {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>