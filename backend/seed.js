require('dotenv').config();
const { Client } = require('pg');
const { faker } = require('@faker-js/faker');

const pool = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    await pool.connect();

    // Limpiar la tabla
    await pool.query('DELETE FROM products');

    const insertQuery = `
      INSERT INTO products (name, description, price, stock, image_url)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (let i = 0; i < 100; i++) {
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const price = parseFloat(faker.commerce.price());
      const stock = Math.floor(Math.random() * 100);
      const image_url = faker.image.url(); // URL aleatoria

      await pool.query(insertQuery, [name, description, price, stock, image_url]);
    }

    console.log('✅ Seed con 100 productos completada');
  } catch (err) {
    console.error('❌ Error al hacer seed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
})();
