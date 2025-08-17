// src/store/cart.ts
import { defineStore } from 'pinia'
import type { Product, CartItem } from '../types/index'

export const useCartStore = defineStore('cart', {
  
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    total: (state) =>
      state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),

    cantidadTotal: (state) =>
      state.items.reduce((acc, item) => acc + item.quantity, 0),
  },
  actions: {
    agregar(producto: Product) {
      const existente = this.items.find((i) => i.id === producto.id)
      if (existente) {
        existente.quantity++
        console.log(`Producto ${producto.name} ya existe en el carrito. Cantidad actualizada a ${existente.quantity}.`)
      } else {
        console.log(`Producto ${producto.name} agregado al carrito.`)
        this.items.push({ ...producto, quantity: 1 })
      }
    },
    actualizarCantidad(productoId: number, nuevaCantidad: number) {
      const item = this.items.find((i) => i.id === productoId)
      if (item) {
        item.quantity = nuevaCantidad
        if (item.quantity <= 0) {
          this.eliminar(productoId)
        }
      }
    },
    eliminar(productoId: number) {
      this.items = this.items.filter((i) => i.id !== productoId)
    },
    limpiar() {
      this.items = []
    },
    unirConBackend(backendItems: CartItem[]) {
      backendItems.forEach(backendItem => {
        const localItem = this.items.find(i => i.id === backendItem.id)
        if (localItem) {
          // Suma cantidades si ya existe
          localItem.quantity += backendItem.quantity
        } else {
          // Agrega el producto del backend si no está en el local
          this.items.push({ ...backendItem })
        }
      })
    },
  },
})
