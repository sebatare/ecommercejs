<template>
    <div class="login-page">
        <form @submit.prevent="onSubmit">
            <input v-model="email" type="email" placeholder="Correo" required />
            <input v-model="password" type="password" placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const onSubmit = async () => {
    try {
        await auth.login({ email: email.value, password: password.value })
        router.push('/')
    } catch (e) {
        error.value = 'Credenciales inválidas'
    }
}
</script>

<style scoped>
.error {
    color: red;
}
</style>
