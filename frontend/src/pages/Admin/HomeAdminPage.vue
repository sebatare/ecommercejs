<template>
    <div class="home-admin">
        <h1>Panel de Administración</h1>
        <p>Bienvenido al panel de administración. Aquí puedes gestionar productos, categorías y pedidos.</p>

        <div class="admin-actions">
            <router-link to="/admin/products" class="admin-button">Gestionar Productos</router-link>
            <router-link to="/admin/categories" class="admin-button">Gestionar Categorías</router-link>
            <router-link to="/admin/orders" class="admin-button">Gestionar Pedidos</router-link>
        </div>
    </div>
</template>