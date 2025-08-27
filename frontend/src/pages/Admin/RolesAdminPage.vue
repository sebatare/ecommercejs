<template>
    <section class="roles-admin">
        <h1>Gestión de Roles</h1>
        <p class="subtitle">Administra los roles de los usuarios para controlar los permisos y accesos dentro de la
            plataforma.</p>

        <div class="create-role-container">
            <h2>Crear Nuevo Rol</h2>
            <form @submit.prevent="createRole" class="create-form">
                <input v-model="newRoleName" type="text" placeholder="Nombre del nuevo rol" required />
                <button type="submit" class="admin-button" :disabled="creating">
                    <span class="icon">➕</span>
                    {{ creating ? 'Creando...' : 'Crear Rol' }}
                </button>
            </form>
        </div>

        <div class="roles-list-container">
            <div v-if="loading" class="loading-message">
                Cargando roles...
            </div>

            <div v-else-if="error" class="error-message">
                Error al cargar los roles: {{ error }}
            </div>

            <div v-else>
                <h2>Lista de Roles</h2>
                <ul class="roles-list">
                    <li v-for="role in roles" :key="role.id" class="role-item">
                        <span class="role-name">{{ role.name }}</span>
                        <button @click="deleteRole(role.id)" class="delete-button"
                            :disabled="deleting.includes(role.id)">
                            {{ deleting.includes(role.id) ? 'Borrando...' : 'Borrar' }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from './../../utils/api-auth';

interface Role {
    id: number;
    name: string;
}

const roles = ref<Role[]>([]);
const loading = ref(true);
const creating = ref(false);
const deleting = ref<number[]>([]);
const error = ref<string | null>(null);
const newRoleName = ref('');

// Función para obtener la lista de roles
const fetchRoles = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await api.get('/roles');
        roles.value = response.data;
    } catch (err: any) {
        if (err.response) {
            error.value = err.response.data.message || 'Error del servidor';
        } else {
            error.value = 'Error de conexión';
        }
    } finally {
        loading.value = false;
    }
};

// Función para crear un nuevo rol
const createRole = async () => {
    creating.value = true;
    error.value = null;
    try {
        await api.post('/roles', { name: newRoleName.value });
        newRoleName.value = ''; // Limpiar el input
        await fetchRoles(); // Actualizar la lista
    } catch (err: any) {
        if (err.response) {
            error.value = err.response.data.message || 'Error al crear el rol';
        } else {
            error.value = 'Error de conexión';
        }
    } finally {
        creating.value = false;
    }
};

// Función para eliminar un rol
const deleteRole = async (roleId: number) => {
    deleting.value.push(roleId);
    error.value = null;
    try {
        
        await api.delete(`/roles/${roleId}`);
        await fetchRoles(); // Actualizar la lista
    } catch (err: any) {
        if (err.response) {
            error.value = err.response.data.message || 'Error al borrar el rol';
            console.error(err.response.data);
        } else {
            error.value = 'Error de conexión';
        }
    } finally {
        deleting.value = deleting.value.filter(id => id !== roleId);
    }
};

// Cargar roles al montar el componente
onMounted(fetchRoles);
</script>

<style scoped>
.roles-admin {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin-top: 40px;
}

h1 {
    font-size: 2.2rem;
    margin-bottom: 0;
}

.subtitle {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 16px;
    text-align: center;
    max-width: 500px;
}

.create-role-container,
.roles-list-container {
    width: 100%;
    max-width: 600px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #333;
}

.create-form {
    display: flex;
    gap: 10px;
}

.create-form input {
    flex-grow: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
}

.admin-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--color-primary, #4f8cff);
    color: #fff;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: background 0.2s;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.admin-button:hover:not(:disabled) {
    background: var(--color-primary-dark, #3461a4);
}

.admin-button:disabled {
    background-color: #aeb4b9;
    cursor: not-allowed;
}

.icon {
    font-size: 1.3rem;
}

.loading-message,
.error-message {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
}

.error-message {
    color: #e74c3c;
}

.roles-list {
    list-style: none;
    padding: 0;
    margin-top: 20px;
}

.role-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    font-size: 1.1rem;
}

.role-item:last-child {
    border-bottom: none;
}

.delete-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
}

.delete-button:hover:not(:disabled) {
    background-color: #c0392b;
}

.delete-button:disabled {
    background-color: #aeb4b9;
    cursor: not-allowed;
}
</style>