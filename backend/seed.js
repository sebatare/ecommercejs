const pool = require('./src/infrastructure/db/pool');
const { faker } = require('@faker-js/faker');

(async () => {
  try {
    await pool.query('DELETE FROM products');

    const insertQuery = `
      INSERT INTO products (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
    `;

    for (let i = 0; i < 100; i++) {
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const price = parseFloat(faker.commerce.price());
      const stock = Math.floor(Math.random() * 100);

      await pool.query(insertQuery, [name, description, price, stock]);
    }

    console.log('✅ Seed con 100 productos completada');
  } catch (err) {
    console.error('❌ Error al hacer seed:', err);
  } finally {
    process.exit();
  }
})();
