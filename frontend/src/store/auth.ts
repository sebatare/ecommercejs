// src/store/auth.ts
import { defineStore } from 'pinia'
import api from '../utils/axios'
import type { User, LoginPayload, AuthResponse, Cart } from '../types/index'
//Obtengo cart temporal
import { useCartStore } from './cart'



export const useAuthStore = defineStore('auth', {
  
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    cart: null as Cart | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(payload: LoginPayload) {
      const cartTemp = useCartStore()
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)

      // Obtener carrito del backend
      const { data: cartData } = await api.get('/cart/get-cart', {
  headers: {
    Authorization: `Bearer ${this.token}`
  }
})

      // Unir carritos: local (cartTemp.items) + backend (cartData.items)
      cartTemp.unirConBackend(cartData.items)

      // Si quieres, también puedes actualizar el backend con el carrito unificado aquí

      // Actualiza el carrito en el auth store si lo necesitas
      this.cart = { ...cartData, items: cartTemp.items }
    },
    logout() {
      this.token = ''
      this.user = null
      this.cart = null
      localStorage.removeItem('token')
    },
  },
})
