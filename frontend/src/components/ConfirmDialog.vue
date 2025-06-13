<template>
    <div class="modal-overlay" @click.self="cancel">
        <div class="modal">
            <label>{{ message }}</label>
            <div v-if="showQuantityInput" class="form-group">
                <label>Cantidad a eliminar</label>
                <input type="number" v-model.number="quantity" min="1" :max="maxStock" />
            </div>
            <div class="actions">
                <button @click="confirm" class="btn-primary">Eliminar cantidad</button>
                <button v-if="showQuantityInput" @click="deleteAll" class="btn-danger">Eliminar todo</button>
                <button @click="cancel" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ message: string, showQuantityInput?: boolean, maxStock?: number }>()
const emit = defineEmits(['confirm', 'cancel', 'deleteAll'])

const quantity = ref(1)

watch(() => props.maxStock, (newVal) => {
    if (newVal) quantity.value = 1
})

function confirm() {
    emit('confirm', quantity.value)
}
function deleteAll() {
    emit('deleteAll')
}
function cancel() {
    emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal {
    background: #fff;
    border-radius: 8px;
    padding: 2rem;
    min-width: 250px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);
    color: #333;
    font-weight: 600;
}
.form-group label {

    margin-bottom: 15px;

}
.form-group {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
}

.actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: flex-end;
}

.btn-primary {
    background: #1976d2;
    color: #fff;
    border: none;
    padding: 8px 18px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-danger {
    background: #d32f2f;
    color: #fff;
    border: none;
    padding: 8px 18px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-secondary {
    background: #a8a8a8;
    color: #242424;
    border: none;
    padding: 8px 18px;
    border-radius: 4px;
    cursor: pointer;
}


input[type="number"] {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
}
</style>