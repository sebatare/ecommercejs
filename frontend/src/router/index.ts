import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Auth/LoginPage.vue'
import RegisterPage from '../pages/Auth/RegisterPage.vue'
import HomePage from '../pages/Home/HomePage.vue'
import CartPage from '../pages/Cart/CartPage.vue'
import HomeAdminPage from '../pages/Admin/HomeAdminPage.vue'
import ProductsAdminPage from '../pages/Admin/ProductsAdminPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/cart', component: CartPage },
  { path:'/register', component: RegisterPage },
  { path: '/admin', component: HomeAdminPage },
  { path: '/admin/products', component: ProductsAdminPage },
]

const router = createRouter({
  history: createWebHistory('/ecommerce/'),  // <--- aquí pones tu subruta
  routes,
})

export default router
