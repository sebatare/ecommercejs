// Producto.ts
export interface Product {
  id: number
  name: string
  description: string
  createdAt: string
  price: string
  stock: number
  categories: Category[]
}
export interface Category {
  id: number
  name: string
}

// Usuario.ts
export interface User {
  id: number
  name: string
  email: string
  createdAt: number
  role: string
  cart: Cart | null
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
