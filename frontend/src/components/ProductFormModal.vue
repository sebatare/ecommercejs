<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal">
            <h2>{{ product ? 'Editar producto' : 'Agregar producto' }}</h2>
            <form @submit.prevent="save">
                <div class="form-group">
                    <label>Nombre</label>
                    <input v-model="form.name" required maxlength="100" />
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea v-model="form.description" maxlength="500"></textarea>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input v-model.number="form.price" type="any" min="0" required />
                </div>
                <div class="form-group">
                    <label>Stock</label>
                    <input v-model.number="form.stock" type="number" min="0" required />
                </div>
                <div class="form-group">
                    <label>Categorías</label>
                    <div class="checkbox-group">
                        <label v-for="cat in categories" :key="cat.id" class="checkbox-label">
                            <input type="checkbox" :value="cat.id" v-model="form.categoryIds" />
                            {{ cat.name }}
                        </label>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">{{ loading ? 'Guardando...' : 'Guardar' }}</button>
                    <button type="button" @click="close" class="btn-secondary">Cancelar</button>
                </div>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import api from '../utils/axios'
import type { Product, Category } from '../types/index'

const props = defineProps<{ product?: Product | null }>()
const emit = defineEmits(['close', 'saved'])

const form = ref({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryIds: [] as number[]
})
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
    // Cargar categorías para el select
    const { data } = await api.get('/categories')
    categories.value = data

    if (props.product) {
        form.value = {
            name: props.product.name,
            description: props.product.description,
            price: props.product.price,
            stock: props.product.stock,
            categoryIds: props.product.categories?.map(c => c.id) || []
        }
    }
})

function close() {
    emit('close')
}

async function save() {
    loading.value = true
    error.value = ''
    try {
        if (props.product) {
            await api.put(`/products/${props.product.id}`, form.value)
        } else {
            await api.post('/products', form.value)
        }
        emit('saved')
    } catch (e: any) {
        error.value = e.response?.data?.error || 'Error al guardar'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(0.5px);
    color: #333;
}

.modal {
    background: #fff;
    border-radius: 10px;
    padding: 2.5rem;
    min-width: 450px;
    /* antes: 350px */
    max-width: 95vw;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);
}

.form-group {
    margin-bottom: 1.2rem;
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 500;
    margin-bottom: 0.4rem;
    font-size: 16px;
}

input,
textarea,
select {
    padding: 10px;
    /* antes: 8px */
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
    /* antes: 15px */
}

.modal-actions {
    display: flex;
    gap: 1.2rem;
    /* antes: 1rem */
    margin-top: 1.5rem;
    /* antes: 1rem */
}

.btn-primary {
    background: #1976d2;
    color: #fff;
    border: none;
    padding: 10px 22px;
    /* antes: 8px 18px */
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    font-size: 15px;
}

.btn-secondary {
    background: #eee;
    color: #333;
    border: none;
    padding: 10px 22px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 15px;
}

.error {
    color: #d32f2f;
    margin-top: 0.5rem;
    font-size: 14px;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    /* antes: 10px */
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 6px;
    /* antes: 5px */
    font-size: 15px;
}
</style>