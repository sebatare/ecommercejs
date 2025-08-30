import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Auth/LoginPage.vue'
import RegisterPage from '../pages/Auth/RegisterPage.vue'
import HomePage from '../pages/Home/HomePage.vue'
import CartPage from '../pages/Cart/CartPage.vue'
import HomeAdminPage from '../pages/Admin/HomeAdminPage.vue'
import ProductsAdminPage from '../pages/Admin/ProductsAdminPage.vue'
import RolesAdminPage from '../pages/Admin/RolesAdminPage.vue'
import UsersAdminPage from '../pages/Admin/UsersAdminPage.vue'
import UnauthorizedPage from '../pages/UnauthorizedPage.vue'
import { useAuthStore } from '../store/auth'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/cart', component: CartPage },
  { path:'/register', component: RegisterPage },
  { path: '/admin', component: HomeAdminPage, meta: { requiresAdmin: true } },
  { path: '/admin/products', component: ProductsAdminPage },
  { path: '/admin/roles', component: RolesAdminPage },
  { path: '/admin/users', component: UsersAdminPage },
  { path: '/unauthorized',name:'Unauthorized', component: UnauthorizedPage},
]

const router = createRouter({
  history: createWebHistory('/ecommerce/'),  // <--- aquí pones tu subruta
  routes,
})

// Guardián de navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // Verificar si la ruta requiere permisos de admin
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      // 1. Si no está autenticado, redirigir a la página de inicio
      next({ path: '/' })
    } else if (userRole !== 'admin') {
      // 2. Si está autenticado pero no es admin, redirigir a una página de acceso denegado
      next({ name: 'Unauthorized' })
    } else {
      // 3. Si todo está bien, permitir la navegación
      next()
    }
  } else {
    // Para rutas no protegidas, permitir siempre
    next()
  }
})

export default router
