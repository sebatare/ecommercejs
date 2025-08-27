<template>
    <div class="home-admin">
        <h1>Panel de Administración</h1>
        <p>Bienvenido al panel de administración. Aquí puedes gestionar productos, categorías y pedidos.</p>

        <div class="admin-actions">
            <router-link to="/admin/users" class="admin-button">Gestionar Usuarios</router-link>
            <router-link to="/admin/products" class="admin-button">Gestionar Productos</router-link>
            <router-link to="/admin/categories" class="admin-button">Gestionar Categorías</router-link>
            <router-link to="/admin/orders" class="admin-button">Gestionar Pedidos</router-link>
            <router-link to="/admin/carritos" class="admin-button">Gestionar Carritos</router-link>
            <router-link to="/admin/dashboard" class="admin-button">Dashboard ventas</router-link>
            <router-link to="/admin/roles" class="admin-button">Gestionar Roles</router-link>
            
        </div>
    </div>
</template>
<style scoped>
.admin-button {
    padding: 10px 20px;
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius);

}
.admin-button:hover {
    background-color: var(--color-bg-dark);
    color: white;
    text-decoration: underline;
}
.admin-actions{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;

}
</style>