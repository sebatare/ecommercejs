<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-8">
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
                        Gestión de Usuarios
                    </h1>
                    <p class="text-gray-600">Administra los usuarios registrados en tu plataforma</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="inline-block mb-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <p class="text-gray-600">Cargando usuarios...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                <p class="text-red-700 font-semibold">❌ {{ error }}</p>
            </div>

            <!-- Users Table -->
            <div v-else class="space-y-6">
                <!-- Desktop Table -->
                <div class="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usuario</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rol</th>
                                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id"
                                    class="border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {{ user.name.charAt(0).toUpperCase() }}
                                            </div>
                                            <div>
                                                <p class="font-semibold text-gray-900">{{ user.name }}</p>
                                                <p class="text-xs text-gray-500">#{{ user.id }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <p class="text-gray-700">{{ user.email }}</p>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span :class="[
                                            'px-3 py-1 rounded-full text-sm font-semibold',
                                            getRoleColor(user.role_id)
                                        ]">
                                            {{ getRoleName(user.role_id) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <button @click="startEdit(user)"
                                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                            ✏️ Editar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Mobile Cards -->
                <div class="md:hidden space-y-4">
                    <div v-for="user in users" :key="user.id"
                        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div class="flex items-start gap-4 mb-4">
                            <div
                                class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {{ user.name.charAt(0).toUpperCase() }}
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-900">{{ user.name }}</h3>
                                <p class="text-sm text-gray-600">{{ user.email }}</p>
                            </div>
                        </div>
                        <div class="mb-4">
                            <span :class="[
                                'px-3 py-1 rounded-full text-sm font-semibold',
                                getRoleColor(user.role_id)
                            ]">
                                {{ getRoleName(user.role_id) }}
                            </span>
                        </div>
                        <button @click="startEdit(user)"
                            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            Editar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Edit Modal -->
            <div v-if="editUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
                        <h3 class="text-xl font-bold text-white">Editar Usuario</h3>
                    </div>

                    <form @submit.prevent="updateUser" class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                            <input v-model="editUser.name" type="text" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input v-model="editUser.email" type="email" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
                            <select v-model.number="editUser.role_id" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                                <option disabled value="">Selecciona un rol</option>
                                <option v-for="role in roles" :key="role.id" :value="role.id">
                                    {{ role.name }}
                                </option>
                            </select>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" :disabled="saving"
                                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
                                {{ saving ? 'Guardando...' : '✓ Guardar' }}
                            </button>
                            <button type="button" @click="cancelEdit"
                                class="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-semibold">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from './../../utils/api-auth'

interface User {
    id: number
    name: string
    email: string
    role_id: number
}

interface Role {
    id: number
    name: string
}

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const editUser = ref<User | null>(null)

const fetchUsers = async () => {
    const response = await api.get('/users')
    users.value = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.roleId,
    }))
}

const fetchRoles = async () => {
    const response = await api.get('/roles')
    roles.value = response.data
}

const getRoleName = (roleId: number) => {
    return roles.value.find(r => r.id === roleId)?.name || 'Desconocido'
}

const getRoleColor = (roleId: number) => {
    const roleName = getRoleName(roleId)
    if (roleName.toLowerCase() === 'admin') {
        return 'bg-red-100 text-red-700'
    } else if (roleName.toLowerCase() === 'customer' || roleName.toLowerCase() === 'cliente') {
        return 'bg-green-100 text-green-700'
    }
    return 'bg-gray-100 text-gray-700'
}

const startEdit = (user: User) => {
    editUser.value = { ...user }
}

const cancelEdit = () => {
    editUser.value = null
}

const updateUser = async () => {
    if (!editUser.value) return

    saving.value = true
    error.value = null
    try {
        await api.put(`/users/${editUser.value.id}`, {
            name: editUser.value.name,
            email: editUser.value.email,
            role_id: editUser.value.role_id,
        })
        await fetchUsers()
        editUser.value = null
    } catch (err: any) {
        if (err.response) {
            switch (err.response.status) {
                case 400:
                    error.value = 'Datos inválidos. Por favor verifica la información.'
                    break
                case 403:
                    error.value = 'No tiene autorización para realizar esta acción.'
                    break
                case 404:
                    error.value = 'Usuario no encontrado.'
                    break
                case 500:
                    error.value = 'Error del servidor. Intente nuevamente más tarde.'
                    break
                default:
                    error.value = 'Ocurrió un error inesperado.'
            }
        }
    } finally {
        saving.value = false
    }
}

onMounted(async () => {
    try {
        await Promise.all([fetchUsers(), fetchRoles()])
    } catch (err: any) {
        error.value = 'No se pudo cargar la información. Intente de nuevo más tarde.'
    } finally {
        loading.value = false
    }
})
</script>