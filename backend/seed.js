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

const categoryNames = [
  'Electrónica',
  'Ropa',
  'Hogar',
  'Libros',
  'Juguetes'
];

(async () => {
  try {
    await pool.connect();

    // Limpiar tablas en orden correcto para evitar errores de FK
    await pool.query('DELETE FROM product_categories');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM cart_items');
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM wishlist');
    await pool.query('DELETE FROM carts');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM product_views');
    await pool.query('DELETE FROM product_reviews');
    await pool.query('DELETE FROM roles');

    // Insertar usuario admin
    const adminName = 'Admin';
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin123'; // Puedes hashearlo si lo deseas
    await pool.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)',
      [adminName, adminEmail, adminPassword, 2]
    );

    // Insertar categorías
    const categoryIds = [];
    for (const name of categoryNames) {
      const res = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id',
        [name]
      );
      categoryIds.push(res.rows[0].id);
    }

    // Insertar productos y vincular con categorías
    const insertProductQuery = `
      INSERT INTO products (name, description, price, stock, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    for (let i = 0; i < 100; i++) {
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const price = parseFloat(faker.commerce.price());
      const stock = Math.floor(Math.random() * 100);
      const image_url = faker.image.url();

      const prodRes = await pool.query(insertProductQuery, [
        name,
        description,
        price,
        stock,
        image_url,
      ]);
      const productId = prodRes.rows[0].id;

      // Vincular el producto con 1 o 2 categorías aleatorias
      const shuffled = categoryIds.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.random() < 0.5 ? 1 : 2);
      for (const catId of selected) {
        await pool.query(
          'INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)',
          [productId, catId]
        );
      }
    }

    console.log('✅ Seed con productos y categorías completada');
  } catch (err) {
    console.error('❌ Error al hacer seed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
})();
