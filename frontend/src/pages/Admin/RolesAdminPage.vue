<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <h1
                    class="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Gestión de Roles
                </h1>
                <p class="text-gray-600">Crea y administra los roles para controlar permisos y accesos</p>
            </div>

            <!-- Create Role Section -->
            <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Rol</h2>
                <form @submit.prevent="createRole" class="flex gap-4">
                    <input v-model="newRoleName" type="text" placeholder="Nombre del nuevo rol..."
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required />
                    <button type="submit" :disabled="creating"
                        class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold">
                        {{ creating ? '⏳ Creando...' : '➕ Crear' }}
                    </button>
                </form>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="inline-block mb-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <p class="text-gray-600">Cargando roles...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                <p class="text-red-700 font-semibold">❌ {{ error }}</p>
            </div>

            <!-- Roles Grid -->
            <div v-else>
                <div v-if="roles.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div class="text-6xl mb-4">🔐</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">No hay roles</h3>
                    <p class="text-gray-600">Crea tu primer rol para empezar</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="role in roles" :key="role.id"
                        class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">

                        <!-- Role Card Header -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {{ role.name.charAt(0).toUpperCase() }}
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-gray-900">{{ role.name }}</h3>
                                    <p class="text-xs text-gray-500">#{{ role.id }}</p>
                                </div>
                            </div>
                            <span :class="[
                                'px-3 py-1 rounded-full text-xs font-semibold',
                                getRoleColor(role.name)
                            ]">
                                {{ roleTypeLabel(role.name) }}
                            </span>
                        </div>

                        <!-- Permissions -->
                        <div class="mb-6">
                            <p class="text-xs font-semibold text-gray-600 mb-2 uppercase">Permisos</p>
                            <div class="space-y-1">
                                <div v-for="perm in getPermissions(role.name)" :key="perm"
                                    class="text-sm text-gray-700 flex items-center gap-2">
                                    <span class="text-green-500">✓</span> {{ perm }}
                                </div>
                            </div>
                        </div>

                        <!-- Delete Button -->
                        <button @click="deleteRole(role.id)" :disabled="deleting.includes(role.id)"
                            class="w-full px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold text-sm">
                            {{ deleting.includes(role.id) ? '⏳ Borrando...' : '🗑️ Eliminar' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from './../../utils/api-auth'

interface Role {
    id: number
    name: string
}

const roles = ref<Role[]>([])
const loading = ref(true)
const creating = ref(false)
const deleting = ref<number[]>([])
const error = ref<string | null>(null)
const newRoleName = ref('')

const roleTypeLabel = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower === 'admin' || lower === 'administrator') return 'Administrador'
    if (lower === 'customer' || lower === 'cliente' || lower === 'user') return 'Cliente'
    return 'Personalizado'
}

const getRoleColor = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower === 'admin' || lower === 'administrator') {
        return 'bg-red-100 text-red-700'
    } else if (lower === 'customer' || lower === 'cliente' || lower === 'user') {
        return 'bg-green-100 text-green-700'
    }
    return 'bg-blue-100 text-blue-700'
}

const getPermissions = (roleName: string) => {
    const lower = roleName.toLowerCase()
    if (lower === 'admin' || lower === 'administrator') {
        return [
            'Gestionar productos',
            'Gestionar usuarios',
            'Gestionar órdenes',
            'Ver reportes',
            'Acceso completo'
        ]
    } else if (lower === 'customer' || lower === 'cliente' || lower === 'user') {
        return [
            'Comprar productos',
            'Ver órdenes',
            'Editar perfil',
            'Agregar favoritos'
        ]
    }
    return ['Permisos personalizados']
}

const fetchRoles = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await api.get('/roles')
        roles.value = response.data
    } catch (err: any) {
        if (err.response) {
            error.value = err.response.data.message || 'Error del servidor'
        } else {
            error.value = 'Error de conexión'
        }
    } finally {
        loading.value = false
    }
}

const createRole = async () => {
    if (!newRoleName.value.trim()) {
        error.value = 'Por favor ingresa un nombre para el rol'
        return
    }

    creating.value = true
    error.value = null
    try {
        await api.post('/roles', { name: newRoleName.value })
        newRoleName.value = ''
        await fetchRoles()
    } catch (err: any) {
        if (err.response) {
            error.value = err.response.data.message || 'Error al crear el rol'
        } else {
            error.value = 'Error de conexión'
        }
    } finally {
        creating.value = false
    }
}

const deleteRole = async (roleId: number) => {
    deleting.value.push(roleId)
    error.value = null
    try {
        await api.delete(`/roles/${roleId}`)
        await fetchRoles()
    } catch (err: any) {
        if (err.response) {
            error.value = err.response.data.message || 'Error al borrar el rol'
        } else {
            error.value = 'Error de conexión'
        }
    } finally {
        deleting.value = deleting.value.filter(id => id !== roleId)
    }
}

onMounted(fetchRoles)
</script>