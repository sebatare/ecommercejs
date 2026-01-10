// src/store/cart.ts
import { defineStore } from 'pinia'
import type { Product, CartItem } from '../types'
import api from '../utils/api-auth'
import { useAuthStore } from './auth'

const CART_STORAGE_KEY = 'shopping_cart'
let persistTimeout: number | null = null

function debounce(fn: () => void, delay = 400) {
  if (persistTimeout) clearTimeout(persistTimeout)
  persistTimeout = window.setTimeout(() => {
    persistTimeout = null
    fn()
  }, delay)
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    lastSync: null as Date | null,
  }),

  getters: {
    total: state =>
      state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),

    cantidadTotal: state =>
      state.items.reduce((acc, i) => acc + i.quantity, 0),

    isEmpty: state => state.items.length === 0,
  },

  actions: {
    /* ---------------- LOCAL OPERATIONS ---------------- */

    agregar(producto: Product, cantidad = 1): void {
      const existente = this.items.find(i => i.productId === producto.id)

      if (existente) {
        existente.quantity += cantidad
      } else {
        this.items.push({
          id: Date.now(),
          cartId: 0,
          productId: producto.id,
          productName: producto.name,
          imageUrl: producto.imageUrl,
          quantity: cantidad,
          price: producto.price,
        })
      }

      this.persistir()
    },

    incrementar(productId: number): void {
      const item = this.items.find(i => i.productId === productId)
      if (!item) return

      item.quantity++
      this.persistirDebounced()
    },

    decrementar(productId: number): void {
      const item = this.items.find(i => i.productId === productId)
      if (!item) return

      if (item.quantity > 1) {
        item.quantity--
        this.persistirDebounced()
      } else {
        this.eliminar(productId)
      }
    },

    eliminar(productId: number): void {
      this.items = this.items.filter(i => i.productId !== productId)
      this.persistir()
    },
      
    limpiar(): void {
      this.items = []
      this.lastSync = null
      localStorage.removeItem(CART_STORAGE_KEY)
    },

    /* ---------------- SYNC STRATEGY ---------------- */

    async sincronizarConBackendRemoto(): Promise<void> {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) return

      try {
        const { data } = await api.get('/cart/get-cart', {
          headers: { Authorization: `Bearer ${auth.token}` },
        })

        if (this.items.length === 0) {
          // backend manda
          this.reemplazar(data.items)
        } else {
          // merge
          this.unir(data.items)
          await this.actualizarBackend()
        }

        this.lastSync = new Date()
      } catch (error) {
        console.warn('⚠️ No se pudo sincronizar carrito')
      }
    },

    unir(backendItems: CartItem[]): void {
      backendItems.forEach(b => {
        const local = this.items.find(i => i.productId === b.productId)
        if (local) {
          local.quantity += b.quantity
        } else {
          this.items.push({ ...b })
        }
      })

      this.persistir()
    },

    reemplazar(backendItems: CartItem[]): void {
      this.items = [...backendItems]
      this.persistir()
    },

    /* ---------------- BACKEND ---------------- */

    async actualizarBackend(): Promise<void> {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) return

      const payload = this.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      }))

      try {
        await api.put(
          '/cart/update-cart',
          { items: payload },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        )
      } catch {
        console.warn('⚠️ Sync pendiente (retry luego)')
      }
    },

    /* ---------------- PERSISTENCE ---------------- */

    persistir(): void {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items))

      if (useAuthStore().isAuthenticated) {
        this.actualizarBackend()
      }
    },

    persistirDebounced(): void {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items))

      debounce(() => {
        if (useAuthStore().isAuthenticated) {
          this.actualizarBackend()
        }
      })
    },

    cargarCarrito(): void {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) this.items = JSON.parse(saved)
    },
  },
})
