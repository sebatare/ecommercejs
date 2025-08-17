// src/infrastructure/db/pool.js
require('dotenv').config(); // Carga las variables de .env
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'reactecommerce',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en la conexión con PostgreSQL', err);
});


module.exports = pool;
