<!-- src/components/layout/Navbar.vue -->
<template>
    <nav class="navbar" aria-label="Navegación principal">
        <div class="logo">
            <router-link to="/">Mi Tienda</router-link>
        </div>
        <button class="menu-toggle" @click="menuAbierto = !menuAbierto" aria-label="Abrir menú"
            :aria-expanded="menuAbierto">



            <span :class="{ open: menuAbierto }"></span>
            <span :class="{ open: menuAbierto }"></span>
            <span :class="{ open: menuAbierto }"></span>
        </button>
        <ul class="nav-links" :class="{ open: menuAbierto }">
            <li>
                <router-link to="/">Inicio</router-link>
            </li>
            <li class="cart-icon">
                <router-link to="/cart" class="cart-link" aria-label="Ver carrito">
                    <Icon icon="mdi:cart" width="24" />
                    <span class="cart-count" v-if="cart.cantidadTotal > 0" aria-label="Productos en el carrito">{{
                        cart.cantidadTotal }}</span>
                </router-link>
            </li>
            <li v-if="auth.isAuthenticated">
                <span class="user-name">{{ auth.user?.name }}</span>
                <button @click="logout" class="logout-btn">Cerrar sesión</button>
            </li>
            <li v-else>
                <router-link to="/login">Iniciar sesión</router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../store/auth'
import { useCartStore } from '../../store/cart'

const auth = useAuthStore()
const cart = useCartStore()
const menuAbierto = ref(false)

function logout() {
    auth.logout()
    menuAbierto.value = false
}
</script>


<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: white;
    flex-wrap: wrap;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.logo a {
    color: white;
    text-decoration: none;
    font-size: 2rem;
    font-weight: bold;
}

.menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 200;
}

.menu-toggle span {
    display: block;
    width: 28px;
    height: 4px;
    margin: 4px 0;
    background: white;
    border-radius: 2px;
    transition: 0.3s;
}

.menu-toggle span.open:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}

.menu-toggle span.open:nth-child(2) {
    opacity: 0;
}

.menu-toggle span.open:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
    align-items: center;
    margin: 0;
    padding: 0;
    transition: max-height 0.3s, opacity 0.3s;
}

@media (max-width: 800px) {
    .menu-toggle {
        display: flex;
    }

    .nav-links {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--color-secondary);
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
        padding: 1rem 2rem;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .nav-links.open {
        max-height: 400px;
        opacity: 1;
        pointer-events: auto;
        transition: max-height 0.3s, opacity 0.3s;
    }

    .nav-links li {
        width: 100%;
        margin: 0.5rem 0;
    }
}

.cart-icon {
    position: relative;
}

.cart-link {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.cart-count {
    position: absolute;
    top: -6px;
    right: -10px;
    background: var(--color-tertiary);
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 50%;
    font-weight: bold;
}

.user-name {
    margin-right: 0.5rem;
    font-weight: 500;
}

.logout-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 0.5rem;
    transition: color 0.2s;
}

.logout-btn:hover {
    color: var(--color-primary-hover);
}
</style>
