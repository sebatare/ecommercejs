// src/store/auth.ts
import { defineStore } from 'pinia'
import api from '../utils/api-auth'
import type { User, LoginPayload, AuthResponse, Cart } from '../types/index'
//Obtengo cart temporal
import { useCartStore } from './cart'
import { jwtDecode } from "jwt-decode";



export const useAuthStore = defineStore('auth', {
  
  state: () => ({
  user: null as User | null,
  token: localStorage.getItem('token') || '',
  cart: null as Cart | null,
  loading: true // <--- nuevo
}),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(payload: LoginPayload) {
      const cartTemp = useCartStore()
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      this.token = data.token
      if(this.token) {

      }
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

    async initializeFromToken() {
      this.loading = true
      try {
        if (this.token) {
          interface DecodedToken {
            id: string;
            name: string;
            email: string;
            role: string;
            exp?: number;
            [key: string]: any;
          }
          const decoded = jwtDecode<DecodedToken>(this.token);
          if (decoded.exp && Date.now() / 1000 > decoded.exp) {
            this.logout()
          } else {
            this.user = {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
            }
          }
        }
      } finally {
        this.loading = false
      }
    },
  },
})
