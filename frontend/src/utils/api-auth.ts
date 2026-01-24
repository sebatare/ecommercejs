// src/utils/api-auth.ts
import axios from 'axios'

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true, //Envio de cookies en solicitudes CORS
})

/* Ya no es necesario guardar el token en el almacenamiento local ni añadirlo manualmente a los encabezados

apiAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
*/
export default apiAuth