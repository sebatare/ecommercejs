// src/infrastructure/db/pool.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'reactecommerce',
    password: 'admin',
    port: 5432,
});

module.exports = pool;
