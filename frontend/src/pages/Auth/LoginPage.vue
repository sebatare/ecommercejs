<template>
    <div class="login-page">
        <form class="login-form" @submit.prevent="onSubmit">
            <input v-model="email" type="email" placeholder="Correo" required />
            <input v-model="password" type="password" placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
            <p v-if="error" class="error">{{ error }}</p>
            <p class="register-prompt">¿No tienes una cuenta? <router-link to="/register">Regístrate</router-link></p>

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
        if(auth.user?.role === 'Admin') {
            router.push('/admin')
        }
    } catch (e) {
        error.value = 'Credenciales inválidas'
    }
}
</script>

<style scoped>

input {
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.login-form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
    background-color: #e6e6e6;
    padding: 20px;
    border-radius: 8px;
    height: 340px;
    justify-content: space-evenly;
}

.register-prompt {
    margin-top: 10px;
    color: rgb(78, 78, 78);
}

.error {
    color: red;
}
</style>
