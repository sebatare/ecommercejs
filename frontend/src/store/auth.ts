// src/store/auth.ts
import { defineStore } from 'pinia'
import api from '../utils/api-auth'
import type { User, LoginPayload, RegisterPayload, AuthResponse } from '../types'
import { jwtDecode } from 'jwt-decode'
import { useCartStore } from './cart'
import type { Router } from 'vue-router'

const TOKEN_KEY = 'token'
const isDev = process.env.NODE_ENV  

interface DecodedToken {
  id: string
  name: string
  email: string
  role: string
  roleId: number
  createdAt?: number
  imageUrl?: string
  exp?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem(TOKEN_KEY) || '',
    loading: true,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: state => !!state.token && !!state.user,
    
    isAdmin: state => state.user?.role === 'Admin',

    isTokenExpired: state => {
      if (!state.token) return true
      try {
        const decoded = jwtDecode<DecodedToken>(state.token)
        return decoded.exp ? Date.now() / 1000 > decoded.exp : true
      } catch {
        return true
      }
    },

    currentUser: state => {
      if (!state.user) throw new Error('Usuario no autenticado')
      return state.user
    },
  },

  actions: {
    async login(payload: LoginPayload): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.post<AuthResponse>('/auth/login', payload)

        this.token = data.token
        this.user = data.user
        this.persistirToken(data.token)

        // Sincronizar carrito post-login
        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()


      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Error al iniciar sesión'
        this.error = errorMsg
        if (isDev) console.error('❌ Error en login:', errorMsg)
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(dataFromGoogle: AuthResponse): Promise<void> {
      this.loading = true
      this.error = null

      try {
        this.token = dataFromGoogle.token
        this.user = dataFromGoogle.user
        this.persistirToken(dataFromGoogle.token)

        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()


      } catch (error: any) {
        this.error = 'Error en login con Google'
        if (isDev) console.error('❌ Error en Google login:', error)
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
        
        this.token = data.token
        this.user = data.user
        this.persistirToken(data.token)

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
        if (isDev) console.error('❌ Error en registro:', errorMsg)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout(): Promise<void> {
      const cart = useCartStore()
      cart.limpiar()

      this.token = ''
      this.user = null
      this.error = null

      localStorage.removeItem(TOKEN_KEY)
    },

    async initializeFromToken(): Promise<void> {
      this.loading = true

      try {
        if (!this.token || this.isTokenExpired) {
          await this.logout()
          return
        }

        const decoded = jwtDecode<DecodedToken>(this.token)

        this.user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          roleId: decoded.roleId || null,
          createdAt: decoded.createdAt || null,
          imageUrl: decoded.imageUrl || '',
          cart: null,
        }

        await this.verificarTokenConBackend()

      } catch (error) {
        if (isDev) console.error('❌ Error inicializando token:', error)
        await this.logout()
      } finally {
        this.loading = false
      }
    },

    async verificarTokenConBackend(): Promise<void> {
      try {
        const { data } = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        })

        this.user = data.user
      } catch (error) {
        if (isDev) console.error('❌ Error verificando token con backend:', error)
        throw error
      }
    },

    persistirToken(token: string): void {
      localStorage.setItem(TOKEN_KEY, token)
    },

    clearError(): void {
      this.error = null
    },
  },
})