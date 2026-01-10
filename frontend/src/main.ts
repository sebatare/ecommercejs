import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles/style.css'
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

await auth.initializeFromToken()
await cart.cargarCarrito()
app.mount('#app')
})()