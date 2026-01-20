// src/infrastructure/db/pool.js
require('dotenv').config(); // Carga las variables de .env
const { Pool } = require('pg');

const isTest = process.env.APP_ENV === 'test';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: isTest ? process.env.DB_TEST_NAME : process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});


console.log('Base de datos:', isTest ? process.env.DB_TEST_NAME : process.env.DB_NAME);

pool.on('connect', () => {

});

pool.on('error', (err) => {
    console.error('❌ Error en la conexión con base de datos', err);
});


module.exports = pool;
