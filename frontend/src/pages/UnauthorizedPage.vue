<template>
  <div class="unauthorized-container">
    <h1 class="unauthorized-title">Acceso Denegado</h1>
    <p class="unauthorized-message">No tienes permiso para ver esta página.</p>
    <router-link to="/" class="unauthorized-button">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.unauthorized-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
  color: #343a40;
}

.unauthorized-title {
  font-size: 3rem;
  color: #dc3545;
  margin-bottom: 20px;
}

.unauthorized-message {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.unauthorized-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.unauthorized-button:hover {
  background-color: #0056b3;
}
</style>