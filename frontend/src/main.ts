import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles/style.css'
import './assets/styles/themes.css'
import { useAuthStore } from './store/auth'
import { useCartStore } from './store/cart'
import GoogleSignInPlugin from 'vue3-google-signin'

//Crea primero la app y pinia
(async()=>{
const app = createApp(App)
const pinia = createPinia()

app.use(GoogleSignInPlugin, {
  clientId: '827438067472-k8bqlurssli7853d6if5qtrgopp5ourv.apps.googleusercontent.com'
})

app.use(pinia)
app.use(router)

//Ahora ya puedes usar el store con seguridad
const auth = useAuthStore()
const cart = useCartStore()

try {
  // Verificar si ya hay sesión con cookie
  await auth.verificarTokenConBackend()

  // Solo cargar carrito si hay usuario logueado
  if (auth.isAuthenticated) {
    try {
      await cart.cargarCarrito()
    } catch (err) {
      console.warn('Error cargando carrito:', err)
    }
  }
} catch (err) {
  console.error('Error inicializando app:', err)
} finally {
  app.mount('#app')
}
})()
