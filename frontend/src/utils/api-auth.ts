// src/utils/api-auth.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true, //Envio de cookies en solicitudes CORS
})

// Flag para evitar múltiples intentos de refresh simultaneos
let isRefreshing = false
let failedQueue: Array<(value: void) => void> = []

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom()
    } else {
      prom()
    }
  })
  
  isRefreshing = false
  failedQueue = []
}

/**
 * Interceptor para manejar errores 401 y refrescar el token automáticamente
 */
apiAuth.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = originalRequest.url || ''

    // No intentar refrescar si:
    // 1. Ya es un reintento (_retry = true)
    // 2. Es un endpoint de refresh mismo (evitar loop infinito)
    // 3. Es un endpoint de auth (login, register, etc.)
    const isAuthEndpoint = requestUrl.includes('/auth/')
    const shouldNotRefresh = originalRequest._retry || isAuthEndpoint

    if (error.response?.status === 401 && !shouldNotRefresh) {
      if (isRefreshing) {
        // Si ya estamos refrescando, encolar la request
        return new Promise((resolve) => {
          failedQueue.push(() => {
            resolve(apiAuth(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Intentar refrescar el token
        await apiAuth.post('/auth/refresh')
        
        processQueue(null)
        
        // Reintentar la solicitud original
        return apiAuth(originalRequest)
      } catch (err) {
        processQueue(err as AxiosError)
        
        // Si el refresh falla, no redirigir automáticamente
        // El usuario puede estar sin sesión, que es válido
        console.warn('No se pudo refrescar el token:', err)
        
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default apiAuth