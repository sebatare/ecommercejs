// src/store/auth.ts
import { defineStore } from 'pinia'
import api from '../utils/api-auth'
import type { User, LoginPayload, RegisterPayload, AuthResponse } from '../types'
import { useCartStore } from './cart'
import type { Router } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: state => !!state.user,
    
    isAdmin: state => state.user?.role === 'admin',



    currentUser: state => {
      if (!state.user) throw new Error('Usuario no autenticado')
      return state.user
    },
  },

  actions: {
    async login(credentials: LoginPayload): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials)
        
        this.user = data.user


        // Sincronizar carrito post-login
        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()


      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Error al iniciar sesión'
        this.error = errorMsg
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(dataFromGoogle: AuthResponse): Promise<void> {
      this.loading = true
      this.error = null

      try {

        this.user = dataFromGoogle.user

        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()


      } catch (error: any) {
        this.error = 'Error en login con Google'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(payload: RegisterPayload, router: Router): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.post<AuthResponse>('/auth/register', payload)
        this.user = data.user

        // Sincronizar carrito post-registro
        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()

        
        // Solo navegar si todo fue exitoso
        router.push('/')

      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Error al registrarse'
        this.error = errorMsg
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout(): Promise<void> {
      const cart = useCartStore()
      cart.limpiar()
      this.user = null
      this.error = null
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.warn('⚠️ Error during logout:', error)
      }
    },


    async verificarTokenConBackend(): Promise<void> {
  try {
    const { data } = await api.get('/auth/me')
    this.user = data.user
  } catch (error) {
    this.user = null
    console.log('No hay sesión activa')
  }
  finally {
    this.loading = false
  }
},


    clearError(): void {
      this.error = null
    },
  },
})