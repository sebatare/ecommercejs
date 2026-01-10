<template>
    <div class="login-page">
        <form class="login-form" @submit.prevent="onSubmit">
            <h2 class="form-title">Bienvenido</h2>

            <div class="input-group">
                <label for="email">Correo electrónico</label>
                <input v-model="email" type="email" placeholder="correo@ejemplo.com" required />
            </div>

            <div class="input-group">
                <label for="password">Contraseña</label>
                <input v-model="password" type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" class="submit-btn">
                Iniciar sesión
            </button>

            <p v-if="error" class="error">{{ error }}</p>

            <div class="divider">
                <span>o continúa con</span>
            </div>

            <div class="social-buttons">
                <GoogleSignInButton @success="handleSuccess" @error="handleError" theme="filled_blue" shape="pill"
                    text="continue_with" prompt="select_account" />


                <button type="button" class="social-btn facebook-btn" @click="loginWithFacebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </button>

                <button type="button" class="social-btn x-btn" @click="loginWithX">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                </button>
            </div>

            <p class="register-prompt">
                ¿No tienes una cuenta?
                <router-link to="/register" class="register-link">Regístrate</router-link>
            </p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import axios from 'axios'
import { GoogleSignInButton } from 'vue3-google-signin';

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const handleSuccess = async (response: any) => {
    const { credential } = response;

    try {
        // Enviamos el token al backend de Node.js
        const res = await axios.post('http://localhost:3002/api/auth/google', {
            token: credential,
        });
        auth.loginWithGoogle(res.data);
    } catch (error) {
        console.error('Error al validar en el backend', error);
    }
};

const handleError = () => {
    console.error('Error al iniciar sesión con Google');
};



const onSubmit = async () => {
    try {
        await auth.login({ email: email.value, password: password.value })

        if (auth.user?.role === 'Admin') {
            router.push('/admin')
        } else {
            router.push('/')
        }
    } catch (e) {
        error.value = 'Credenciales inválidas'
    }
}

const loginWithFacebook = () => {
    // Implementar OAuth con Facebook
    console.log('Login con Facebook')
    // window.location.href = 'TU_BACKEND_URL/auth/facebook'
}

const loginWithX = () => {
    
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}

/* Efecto de burbujas flotantes en el fondo */
.login-page::before,
.login-page::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
}

.login-page::before {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
}

.login-page::after {
    width: 200px;
    height: 200px;
    bottom: -50px;
    right: -50px;
    animation-delay: 2s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

.login-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    padding: 40px;
    gap: 20px;

    /* Glassmorphism effect */
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

    /* Animación de entrada */
    animation: slideIn 0.5s ease-out;
    position: relative;
    z-index: 1;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-title {
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
    margin: 0 0 10px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    color: #ffffff;
    font-family: var(--font-serif);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

input {
    padding: 14px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    color: #ffffff;
    font-size: 15px;
    transition: all 0.3s ease;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn {
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.submit-btn:active {
    transform: translateY(0);
}

.error {
    color: #ff6b6b;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    animation: shake 0.5s ease;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-10px);
    }

    75% {
        transform: translateX(10px);
    }
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 10px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.divider span {
    padding: 0 15px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 500;
}

.social-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.social-btn:active {
    transform: translateY(0);
}

.google-btn {
    color: #3c4043;
}

.google-btn:hover {
    background: rgba(255, 255, 255, 1);
}

.facebook-btn {
    color: #1877f2;
}

.facebook-btn:hover {
    background: rgba(24, 119, 242, 0.1);
}

.x-btn {
    color: #000000;
}

.x-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

.register-prompt {
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    margin: 0;
}

.register-link {
    color: #ffffff;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
}

.register-link:hover {
    border-bottom: 2px solid #ffffff;
}

/* Responsive */
@media (max-width: 480px) {
    .login-form {
        padding: 30px 20px;
    }

    .form-title {
        font-size: 24px;
    }

    .social-buttons {
        flex-direction: column;
    }

    .social-btn {
        width: 100%;
    }
}
</style>