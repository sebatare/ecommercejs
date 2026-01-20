// Producto.ts
export interface Product {
  id: number
  name: string
  description: string
  createdAt: string 
  price: number
  stock: number
  categories: Category[]
  discount_percentage: number
  imageUrl: string
  rate: number
}
export interface Category {
  id: number
  name: string
}

// Usuario.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: number | null
  role: string | null
  cart: Cart | null
  imageUrl: string
}

// Auth.ts
    export interface LoginPayload {
      email: string
      password: string
    }

    export interface RegisterPayload {
      name: string
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
  productName: string
  imageUrl: string
  quantity: number
  price: number
}

export interface GoogleJwtPayload {
  email: string
  name: string
  picture: string
  sub: string
}


