// src/store/auth.ts
import { defineStore } from 'pinia'
import api from '../utils/axios'
import type { User, LoginPayload, AuthResponse } from '../types/index'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async login(payload: LoginPayload) {
      const { data } = await api.post<AuthResponse>('/login', payload)
      this.token = data.token
      this.usuario = data.usuario
      localStorage.setItem('token', data.token)
    },
    logout() {
      this.token = ''
      this.usuario = null
      localStorage.removeItem('token')
    },
  },
})
