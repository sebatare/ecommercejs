import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/ecommerce/',  // <--- esto hace que los assets se carguen correctamente
  plugins: [vue()],
})
