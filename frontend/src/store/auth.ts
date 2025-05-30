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
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(payload: LoginPayload) {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
