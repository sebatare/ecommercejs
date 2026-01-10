// src/store/auth.ts
import { defineStore } from 'pinia'
import api from '../utils/api-auth'
import type { User, LoginPayload, AuthResponse } from '../types'
import { jwtDecode } from 'jwt-decode'
import { useCartStore } from './cart'

const TOKEN_KEY = 'token'

interface DecodedToken {
  id: string
  name: string
  email: string
  role: string
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

        // 🔑 Sync carrito post-login
        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()

      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión'
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

      } catch (error) {
        this.error = 'Error en login con Google'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(payload: LoginPayload): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.post<AuthResponse>('/auth/register', payload)

        this.token = data.token
        this.user = data.user
        this.persistirToken(data.token)

        const cart = useCartStore()
        await cart.sincronizarConBackendRemoto()

      } catch (error) {
        this.error = 'Error al registrarse'
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
          this.logout()
          return
        }

        const decoded = jwtDecode<DecodedToken>(this.token)

        this.user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          createdAt: decoded.createdAt || null,
          imageUrl: decoded.imageUrl || '',
          cart: null,
        }

        await this.verificarTokenConBackend()

      } catch {
        this.logout()
      } finally {
        this.loading = false
      }
    },

    async verificarTokenConBackend(): Promise<void> {
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${this.token}` },
      })

      this.user = data.user
    },

    persistirToken(token: string): void {
      localStorage.setItem(TOKEN_KEY, token)
    },

    clearError(): void {
      this.error = null
    },
  },
})
