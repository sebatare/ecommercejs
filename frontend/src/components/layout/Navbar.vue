<template>
  <nav class="navbar" aria-label="Navegación principal">
    <div class="navbar__logo">
      <router-link to="/">Mi Tienda</router-link>
    </div>

    <button class="navbar__toggle" @click="menuAbierto = !menuAbierto" :aria-expanded="menuAbierto"
      aria-label="Abrir menú">
      <span :class="{ open: menuAbierto }"></span>
      <span :class="{ open: menuAbierto }"></span>
      <span :class="{ open: menuAbierto }"></span>
    </button>

    <ul class="navbar__links" :class="{ open: menuAbierto }">
      <li><router-link to="/">Inicio</router-link></li>

      <li class="cart">
        <router-link to="/cart" class="cart__link" aria-label="Ver carrito">
          <Icon icon="mdi:cart" width="24" />
          <span v-if="cart.cantidadTotal > 0" class="cart__count"
            :aria-label="`${cart.cantidadTotal} productos en el carrito`">
            {{ cart.cantidadTotal }}
          </span>
        </router-link>
      </li>

      <li v-if="auth.loading">
        <span>Cargando usuario...</span>
      </li>
      <li v-else-if="auth.isAuthenticated">
        <span class="navbar__user">{{ userNameCapitalized }}</span>
        <button @click="logout" class="navbar__logout">Cerrar sesión</button>
      </li>
      <li v-else>
        <router-link to="/login">Iniciar sesión</router-link>
      </li>
      <li v-if="auth.isAuthenticated && auth.user?.role === 'Admin'">
        <router-link to="/admin">Panel admin</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../store/auth'
import { useCartStore } from '../../store/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const menuAbierto = ref(false)
const router = useRouter()

const userNameCapitalized = computed(() => {
  console.log("User name:", auth.user?.name)
  return auth.user?.name
    ? auth.user.name.charAt(0).toUpperCase() + auth.user.name.slice(1)
    : ''
})

function logout() {
  auth.logout()
  menuAbierto.value = false
  cart.limpiar()
  //window.location.href = '/'
  router.push('/')
}</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f9f9f9;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 9rem;
}

.navbar__logo a {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2d2d2d !important;
  text-decoration: none;
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  gap: 4px;
}

.navbar__toggle span {
  display: block;
  width: 26px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}

.navbar__toggle span.open:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.navbar__toggle span.open:nth-child(2) {
  opacity: 0;
}

.navbar__toggle span.open:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  color: #2d2d2d;
}

ul li {
  text-decoration: none;
}

ul li:hover {
  text-decoration: underline;
}

.navbar__links.open {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}


.navbar__user {
  font-weight: 500;
}

.navbar__logout {
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.navbar__logout:hover {
  color: var(--color-primary-hover);
}

/* Carrito */
.cart {
  position: relative;
}

.cart__link {
  display: flex;
  align-items: center;
  position: relative;
}

.cart__count {
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

/* Responsive */
@media (max-width: 768px) {
  .navbar__toggle {
    display: flex;
  }

  .navbar__links {
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--color-secondary);
    padding: 1rem 2rem;
    gap: 1rem;
    max-height: 0;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .navbar__links.open {
    max-height: 400px;
    opacity: 1;
    pointer-events: auto;
  }

  .navbar__links li {
    width: 100%;
  }
}
</style>
