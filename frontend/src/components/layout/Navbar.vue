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
      <li><router-link to="/" class="nav-link">Inicio</router-link></li>

      <li class="cart">
        <router-link to="/cart" class="cart__link" aria-label="Ver carrito">
          <div class="cart-icon-wrapper">
            <Icon icon="mdi:cart" width="24" />
            <span v-if="cart.cantidadTotal > 0" class="cart__count"
              :aria-label="`${cart.cantidadTotal} productos en el carrito`">
              {{ cart.cantidadTotal }}
            </span>
          </div>
        </router-link>
      </li>

      <li v-if="auth.isAuthenticated && auth.isAdmin">
        <router-link v-if="!isInAdminPanel" to="/admin/home" class="nav-link admin-link admin-panel-btn"
          title="Ir al Panel de Administración">
          Panel Admin
        </router-link>
        <router-link v-else to="/" class="nav-link back-link" title="Volver a la tienda">
          Volver a tienda
        </router-link>
      </li>

      <li v-if="auth.loading">
        <span class="loading-text">Cargando...</span>
      </li>
      <li v-else-if="auth.isAuthenticated" class="user-section">
        <span class="navbar__user cursor-pointer hover:text-indigo-600 transition-colors" @click="goToProfile">{{
          userNameCapitalized }}</span>
        <button @click="logout" class="navbar__logout">Cerrar sesión</button>
      </li>
      <li v-else>
        <router-link to="/login" class="nav-link login-btn">Iniciar sesión</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../store/auth'
import { useCartStore } from '../../store/cart'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const menuAbierto = ref(false)
const router = useRouter()
const route = useRoute()

const userNameCapitalized = computed(() => {
  return auth.user?.name
    ? auth.user.name.charAt(0).toUpperCase() + auth.user.name.slice(1)
    : ''
})

const isInAdminPanel = computed(() => {
  return route.path.startsWith('/admin')
})

async function logout() {

  auth.logout()
  menuAbierto.value = false
  // Desconectar de Google también

  cart.limpiar()
  router.push('/')
}

function goToProfile() {
  router.push('/profile')
  menuAbierto.value = false
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  height: 80px;

  /* Glassmorphism effect - Tema claro */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(167, 139, 250, 0.15);
  box-shadow: 0 4px 24px rgba(167, 139, 250, 0.08);

  transition: all 0.3s ease;
}

.navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(167, 139, 250, 0.2) 50%,
      transparent 100%);
}

.navbar__logo a {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;
  letter-spacing: -0.5px;
}

.navbar__logo a:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: rgba(167, 139, 250, 0.1);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  gap: 5px;
  transition: all 0.3s ease;
}

.navbar__toggle:hover {
  background: rgba(167, 139, 250, 0.2);
}

.navbar__toggle span {
  display: block;
  width: 24px;
  height: 3px;
  background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}

.navbar__toggle span.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.navbar__toggle span.open:nth-child(2) {
  opacity: 0;
}

.navbar__toggle span.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar__links li {
  margin: 0;
}

.nav-link {
  padding: 0.6rem 1.2rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.08);
}

.nav-link:hover::before {
  width: 60%;
}

.login-btn {
  background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
  color: white !important;
  font-weight: 600;
  padding: 0.7rem 1.5rem;
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(167, 139, 250, 0.3);
  background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
}

.login-btn::before {
  display: none;
}

.admin-link {
  background: rgba(77, 77, 77, 0.15);
  color: #5e5e5e !important;

}

.admin-link:hover {
  background: rgba(32, 32, 32, 0.353);
  color:#131313 !important; 
}

.admin-panel-btn {
  position: relative;
  overflow: hidden;
}

.admin-panel-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 0;
}

.admin-panel-btn:hover::before {
  opacity: 1;
}

.admin-panel-btn {
  z-index: 1;
}

.admin-panel-btn::before {
  display: none;
}

/* Carrito */
.cart {
  position: relative;
}

.cart__link {
  display: flex;
  align-items: center;
}

.cart-icon-wrapper {
  position: relative;
  padding: 0.6rem;
  background: rgba(167, 139, 250, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a78bfa;
}

.cart-icon-wrapper:hover {
  background: rgba(167, 139, 250, 0.2);
  transform: scale(1.05);
}

.cart__count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #f87171 0%, #fb7185 100%);
  color: white;
  font-size: 0.7rem;
  padding: 3px 7px;
  border-radius: 50%;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(248, 113, 113, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

/* Usuario */
.user-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  background: rgba(124, 58, 237, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.navbar__user {
  font-weight: 600;
  color: #a78bfa;
  font-size: 0.95rem;
}

.navbar__logout {
  background: rgba(209, 148, 205, 0.189);
  border: none;
  color: #a78bfa;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.navbar__logout:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.loading-text {
  color: #667eea;
  font-weight: 500;
  animation: fadeInOut 1.5s infinite;
}

@keyframes fadeInOut {

  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem 1.5rem;
    height: 70px;
  }

  .navbar__toggle {
    display: flex;
  }

  .navbar__links {
    flex-direction: column;
    align-items: stretch;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 1.5rem;
    gap: 0.8rem;
    max-height: 0;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border-bottom: 1px solid rgba(124, 58, 237, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .navbar__links.open {
    max-height: 500px;
    opacity: 1;
    pointer-events: auto;
  }

  .navbar__links li {
    width: 100%;
  }

  .nav-link {
    display: block;
    text-align: center;
    padding: 0.8rem;
  }

  .user-section {
    flex-direction: column;
    padding: 1rem;
    text-align: center;
  }

  .navbar__logout {
    width: 100%;
  }

  .cart-icon-wrapper {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .navbar__logo a {
    font-size: 1.5rem;
  }

  .navbar {
    padding: 1rem;
  }
}
</style>