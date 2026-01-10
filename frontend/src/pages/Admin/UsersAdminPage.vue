<template>
    <section class="users-admin">
        <h1>Gestión de Usuarios</h1>
        <p class="subtitle">Aquí puedes ver y gestionar todos los usuarios registrados en la plataforma.</p>

        <div v-if="loading" class="loading-message">
            Cargando datos...
        </div>

        <div v-else-if="error" class="error-message">
            La acción ha fallado: {{ error }}
        </div>

        <div v-else class="users-list-container">
            <h2>Lista de Usuarios</h2>
            <ul class="users-list">
                <li v-for="user in users" :key="user.id" class="user-item">
                    <div class="user-info">
                        <span class="user-name">{{ user.name }}</span>
                        <span class="user-email">{{ user.email }}</span>
                    </div>
                    <button @click="startEdit(user)" class="edit-button">
                        Editar
                    </button>
                </li>
            </ul>
        </div>

        <div v-if="editUser" class="edit-form-container">
            <h3>Editar Usuario</h3>
            <form @submit.prevent="updateUser" class="edit-form">
                <label for="name">Nombre:</label>
                <input v-model="editUser.name" type="text" id="name" required />

                <label for="email">Email:</label>
                <input v-model="editUser.email" type="email" id="email" required />

                <label for="role_id">Rol:</label>
                <select v-model.number="editUser.role_id" id="role_id" required>
                    <option disabled value="">Seleccione un rol</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.name }}
                    </option>
                </select>

                <div class="form-actions">
                    <button type="submit" class="save-button" :disabled="saving">
                        {{ saving ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button type="button" @click="cancelEdit" class="cancel-button">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from './../../utils/api-auth';

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
}

interface Role {
    id: number;
    name: string;
}

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const editUser = ref<User | null>(null);

// Obtiene la lista de usuarios
const fetchUsers = async () => {
    const response = await api.get('/users');
    users.value = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.roleId,
    }));
};

// Obtiene la lista de roles
const fetchRoles = async () => {
    const response = await api.get('/roles');
    roles.value = response.data;
};

// Activa el formulario de edición con los datos del usuario
const startEdit = (user: User) => {
    editUser.value = { ...user };
};

// Cancela la edición
const cancelEdit = () => {
    editUser.value = null;
};

// Actualiza los datos del usuario en la API
const updateUser = async () => {
    if (!editUser.value) return;

    saving.value = true;
    error.value = null;
    try {
        await api.put(`/users/${editUser.value.id}`, {
            name: editUser.value.name,
            email: editUser.value.email,
            role_id: editUser.value.role_id,
        });
        await fetchUsers(); // Refresca la lista
        editUser.value = null; // Cierra el formulario
    } catch (err: any) {
        if(err.response){
            switch(err.response.status){
                case 400:
                    error.value = 'Datos inválidos. Por favor verifica la información.';
                    break;
                case 403:
                    error.value = 'No tiene autorización para realizar esta acción.';
                    break;
                case 404:
                    error.value = 'Usuario no encontrado.';
                    break;
                case 500:
                    error.value = 'Error del servidor. Intente nuevamente más tarde.';
                    break;
                default:
                    error.value = 'Ocurrió un error inesperado.';
            }
        }
        
    } finally {
        saving.value = false;
    }
};

onMounted(async () => {
    try {
        await Promise.all([fetchUsers(), fetchRoles()]);
    } catch (err: any) {
        error.value = 'No se pudo cargar la información. Intente de nuevo más tarde.';
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Las estilos no se modificaron, mantén los que ya tenías */
.users-admin {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    margin-top: 40px;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 0;
}

.subtitle {
    color: #666;
    font-size: 1.2rem;
    text-align: center;
    max-width: 600px;
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

.users-list-container {
    width: 100%;
    max-width: 800px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.users-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

.user-item:last-child {
    border-bottom: none;
}

.user-item:hover {
    background-color: #f2f2f2;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 600;
    font-size: 1.1rem;
}

.user-email {
    color: #777;
    font-size: 0.9rem;
}

.edit-button {
    background: #4f8cff;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
}

.edit-button:hover {
    background: #3461a4;
}

.edit-form-container {
    width: 100%;
    max-width: 500px;
    padding: 24px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.edit-form label {
    font-weight: 500;
    color: #333;
}

.edit-form input,
.edit-form select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.save-button,
.cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.save-button {
    background: #28a745;
    color: #fff;
}

.save-button:hover {
    background: #218838;
}

.save-button:disabled {
    background-color: #aeb4b9;
    cursor: not-allowed;
}

.cancel-button {
    background: #6c757d;
    color: #fff;
}

.cancel-button:hover {
    background: #5a6268;
}
</style>