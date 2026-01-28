import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Auth/LoginPage.vue'
import RegisterPage from '../pages/Auth/RegisterPage.vue'
import HomePage from '../pages/Home/HomePage.vue'
import CartPage from '../pages/Cart/CartPage.vue'
import ProductDetailsPage from '../pages/Products/ProductDetailsPage.vue'
import UserProfilePage from '../pages/User/UserProfilePage.vue'
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage.vue'
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
  { path: '/products/:id', component: ProductDetailsPage, name: 'ProductDetails' },
  { path: '/profile', component: UserProfilePage, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminDashboardPage, meta: { requiresAdmin: true } },
  { path: '/admin/dashboard', component: AdminDashboardPage, meta: { requiresAdmin: true } },
  { path: '/admin/home', component: HomeAdminPage, meta: { requiresAdmin: true } },
  { path: '/admin/products', component: ProductsAdminPage, meta: { requiresAdmin: true } },
  { path: '/admin/roles', component: RolesAdminPage, meta: { requiresAdmin: true } },
  { path: '/admin/users', component: UsersAdminPage, meta: { requiresAdmin: true } },
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

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({ path: '/login' })
    } else {
      next()
    }
  }
  // Verificar si la ruta requiere permisos de admin
  else if (to.meta.requiresAdmin) {
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
