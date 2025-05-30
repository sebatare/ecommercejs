// Producto.ts
export interface Product {
  id: number
  name: string
  description: string
  createdAt: number
  price: string
  stock: number
}

// Usuario.ts
export interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: number
}

// Auth.ts
export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Cart{
    id: number
    userId: number
    createdAt: number
    item :CartItem[]   
}

// CartItem.ts
export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number
  price: number
}
