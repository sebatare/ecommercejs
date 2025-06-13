import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles/style.css'
import { useAuthStore } from './store/auth'
import { jwtDecode } from 'jwt-decode'

//Crea primero la app y pinia
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

//Ahora ya puedes usar el store con seguridad
const auth = useAuthStore()

await auth.initializeFromToken()
app.mount('#app')
