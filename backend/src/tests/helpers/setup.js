// src/tests/helpers/setup.js
const pool = require('../../infrastructure/db/pool');

beforeAll(async () => {
  // Limpiar todo antes de empezar
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM carts');
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM roles');

  // Crear roles base (si no existen)
  await pool.query(`
    INSERT INTO roles (id, name) VALUES 
    (1, 'cliente'),
    (2, 'admin')
    ON CONFLICT (id) DO NOTHING
  `);

  // Crear usuario de prueba con rol 'cliente' (id: 1)
  await pool.query(`
    INSERT INTO users (id, name, email, password, role_id)
    VALUES (1, 'Test User', 'test@correo.com', 'hashed-password', 1)
    ON CONFLICT (id) DO NOTHING
  `);

  await pool.query(`
    INSERT INTO products (id, name, price)
    VALUES (1, 'Producto Test', 1000)
    ON CONFLICT (id) DO NOTHING
  `);
});

// Limpiar datos de tests entre cada test para hacerlos independientes
afterEach(async () => {
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM carts');
});

afterAll(async () => {
  await pool.end();
});
