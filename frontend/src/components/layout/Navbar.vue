<!-- src/components/layout/Navbar.vue -->
<template>
    <nav class="navbar">
        <div class="logo">
            <router-link to="/">Mi Tienda</router-link>
        </div>
        <ul class="nav-links">
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/cart">Carrito</router-link></li>
            <li v-if="auth.isAuthenticated">
                <span>{{ auth.user?.name }}</span>
                <button @click="logout">Cerrar sesión</button>
            </li>
            <li v-else>
                <router-link to="/login">Iniciar sesión</router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../store/auth'

const auth = useAuthStore()

const logout = () => {
    auth.logout()
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-primary);
    padding: 1rem;
    color: white;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
}

button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
}
</style>
