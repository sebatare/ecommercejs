<template>
  <section class="register-page" aria-labelledby="register-title">
    <h1 id="register-title">Crear cuenta</h1>

    <form @submit.prevent="registrar">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Tu nombre"
        />
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="6"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div class="form-group">
        <label for="confirm">Confirmar contraseña</label>
        <input
          id="confirm"
          v-model="form.confirm"
          type="password"
          required
          :class="{ 'input-error': form.confirm && form.confirm !== form.password }"
          placeholder="Repite tu contraseña"
        />
        <p v-if="form.confirm && form.confirm !== form.password" class="error">
          Las contraseñas no coinciden
        </p>
      </div>

      <button type="submit" class="btn-primary" :disabled="form.confirm !== form.password || loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">¡Cuenta creada correctamente!</p>

      <p class="redirect">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
})

const error = ref('')
const success = ref(false)
const loading = ref(false)

const registrar = async () => {
  error.value = ''
  success.value = false

  if (form.password !== form.confirm) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      })
    })

    if (!response.ok) {
      const data = await response.json()
      if (data.errors) {
        error.value = data.errors.map((e: any) => e.msg).join(', ')
      } else if (data.error) {
        error.value = data.error
      } else {
        error.value = 'Error desconocido'
      }
      return
    }

    success.value = true
    form.name = ''
    form.email = ''
    form.password = ''
    form.confirm = ''
  } catch (err: any) {
    error.value = 'Error de conexión con el servidor'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.3rem;
  font-weight: 600;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.input-error {
  border-color: #e74c3c;
}

.error {
  color: #e74c3c;
  font-size: 0.95rem;
  text-align: center;
}

.success {
  color: #2ecc71;
  font-size: 0.95rem;
  text-align: center;
}

.btn-primary {
  padding: 0.75rem;
  background-color: var(--color-primary, #007bff);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.redirect {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.redirect a {
  color: var(--color-primary, #007bff);
  text-decoration: underline;
}
</style>
