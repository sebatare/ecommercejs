/**
 * Configuración de tema única bien organizada
 * Contiene todos los colores, bordes, espaciado y otros estilos
 */

export const appTheme = {
  // Colores principales
  colors: {
    // Primarios
    primary: '#667eea',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    
    // Secundarios
    secondary: '#764ba2',
    
    // Semánticos
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Fondos
    bg: '#ffffff',
    bgLight: '#f9fafb',
    bgDark: '#f3f4f6',
    
    // Texto
    text: '#2d2d2d',
    textLight: '#6b7280',
    
    // Bordes
    border: '#e5e7eb',
  },

  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Bordes redondeados
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Transiciones
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  // Tipografía
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      mono: '"Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },
}

// Exportar función auxiliar para acceder a valores del tema
export function getThemeValue(path: string): string {
  const keys = path.split('.')
  let value: any = appTheme

  for (const key of keys) {
    value = value[key]
    if (value === undefined) {
      console.warn(`Theme value not found: ${path}`)
      return ''
    }
  }

  return value
}
