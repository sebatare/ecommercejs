// src/tests/helpers/setup.js
const pool = require('../../infrastructure/db/pool');

beforeAll(async () => {
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM carts');
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM roles');

  await pool.query(`
    INSERT INTO roles (id, name)
    VALUES (1, 'cliente'), (2, 'admin')
    ON CONFLICT (id) DO NOTHING
  `);
});

// ⚠️ SOLO limpiar tablas hijas
afterEach(async () => {
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM carts');
  await pool.query('DELETE FROM products');
  // ❌ NO users
});

afterAll(async () => {
  await pool.end();
});
