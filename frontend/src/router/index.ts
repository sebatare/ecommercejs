// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/Auth/LoginPage.vue'
import HomePage from '../pages/Home/HomePage.vue'
import CartPage from '../pages/Cart/CartPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/cart', component: CartPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
