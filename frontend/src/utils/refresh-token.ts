/**
 * Utilidades para manejar refresh tokens
 * Este módulo gestiona la lógica de refrescado automático de tokens JWT
 */

import { useAuthStore } from '../store/auth'

let refreshTokenTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Calcula el tiempo de expiración en milisegundos a partir de un JWT
 */
export function getTokenExpirationTime(token: string): number | null {
  try {
    // Decodificar JWT (sin validar firma, solo para obtener exp)
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))
    const expirationTime = payload.exp * 1000 // Convertir a milisegundos

    return expirationTime
  } catch (error) {
    console.error('Error decodificando token:', error)
    return null
  }
}

/**
 * Calcula el tiempo hasta la expiración en milisegundos
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) return null

  const now = Date.now()
  const timeUntilExpiration = expirationTime - now

  return timeUntilExpiration > 0 ? timeUntilExpiration : 0
}

/**
 * Configura un timer que refresca el token antes de que expire
 * El refresh ocurre 1 minuto antes de la expiración
 */
export function setupRefreshTokenTimer(token: string): void {
  clearRefreshTokenTimer()

  const timeUntilExpiration = getTimeUntilExpiration(token)
  if (!timeUntilExpiration) return

  // Refrescar 1 minuto antes de la expiración
  const refreshTime = timeUntilExpiration - 60 * 1000

  if (refreshTime > 0) {
    refreshTokenTimer = setTimeout(async () => {
      try {
        const auth = useAuthStore()
        await auth.refreshAccessToken()
      } catch (error) {
        console.error('Error refrescando token automáticamente:', error)
      }
    }, refreshTime)
  }
}

/**
 * Limpia el timer de refresh
 */
export function clearRefreshTokenTimer(): void {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer)
    refreshTokenTimer = null
  }
}

/**
 * Hook para gestionar el refresh automático de tokens
 * Se ejecuta cuando el usuario se autentica
 */
export function useAutoRefreshToken(): void {
  const auth = useAuthStore()

  // Observar cambios en el usuario para reconfigurar el timer
  const setupTimer = () => {
    // El token está en la cookie httpOnly, así que no podemos acceder directamente
    // Pero podemos usar un tiempo aproximado: 2 horas para accessToken, 7 días para refresh
    // Refrescamos cada 1 hora (antes de que expire el accessToken a las 2 horas)
    
    const oneHourInMs = 60 * 60 * 1000
    refreshTokenTimer = setInterval(async () => {
      try {
        if (auth.isAuthenticated) {
          await auth.refreshAccessToken()
        }
      } catch (error) {
        console.error('Error en refresh automático:', error)
        clearRefreshTokenTimer()
      }
    }, oneHourInMs)
  }

  if (auth.isAuthenticated) {
    setupTimer()
  }
}
