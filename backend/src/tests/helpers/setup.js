// src/tests/helpers/setup.js
const pool = require('../../infrastructure/db/pool');

// =====================================================
// LIMPIEZA CONTROLADA (solo datos mutables)
// =====================================================

async function cleanUserGeneratedData() {
  await pool.query(`
    DELETE FROM cart_items;
    DELETE FROM carts;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM wishlist;
    DELETE FROM product_views;
    DELETE FROM product_reviews;
  `);
}

beforeAll(async () => {
  console.log('Tests iniciados');
  // ⚠️ NO truncar tablas base
});

afterEach(async () => {
  // Cada test empieza sin basura
  await cleanUserGeneratedData();
});

afterAll(async () => {
  console.log('Tests finalizados');
  await pool.end();
});

module.exports = {
  cleanUserGeneratedData,
};
