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

    // 🔥 Limpiar todas las tablas
    await pool.query(`
      TRUNCATE 
        product_views,
        product_reviews,
        product_categories,
        cart_items,
        order_items,
        wishlist,
        carts,
        orders,
        products,
        categories,
        users,
        roles
      RESTART IDENTITY CASCADE
    `);

    // Insertar roles base
    await pool.query(`INSERT INTO roles (name) VALUES ('cliente'), ('admin')`);

    // Insertar usuario admin
    const adminRes = await pool.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Admin', 'admin@admin.com', 'admin123', 2]
    );
    const adminId = adminRes.rows[0].id;

    // Crear usuarios adicionales
    const userIds = [adminId];
    for (let i = 0; i < 10; i++) {
      const res = await pool.query(
        'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [
          faker.person.fullName(),
          faker.internet.email(),
          faker.internet.password(),
          1, // cliente
        ]
      );
      userIds.push(res.rows[0].id);
    }

    // Insertar categorías
    const categoryIds = [];
    for (const name of categoryNames) {
      const res = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id',
        [name]
      );
      categoryIds.push(res.rows[0].id);
    }

    // Insertar productos
    const productIds = [];
    const insertProductQuery = `
      INSERT INTO products (name, description, price, stock, image_url, discount_percentage)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    for (let i = 0; i < 100; i++) {
      const prodRes = await pool.query(insertProductQuery, [
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        parseFloat(faker.commerce.price()),
        Math.floor(Math.random() * 100),
        faker.image.url(),
        Math.floor(Math.random() * 30), // descuento hasta 30%
      ]);
      const productId = prodRes.rows[0].id;
      productIds.push(productId);

      // Vincular con 1 o 2 categorías
      const shuffled = [...categoryIds].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.random() < 0.5 ? 1 : 2);
      for (const catId of selected) {
        await pool.query(
          'INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)',
          [productId, catId]
        );
      }
    }

    // Insertar vistas aleatorias
    for (const productId of productIds) {
      const numViews = Math.floor(Math.random() * 30);
      for (let i = 0; i < numViews; i++) {
        await pool.query(
          'INSERT INTO product_views (product_id, user_id, viewed_at) VALUES ($1, $2, $3)',
          [
            productId,
            faker.helpers.arrayElement(userIds),
            faker.date.recent({ days: 30 }),
          ]
        );
      }
    }

    // Insertar reviews aleatorias
    for (const productId of productIds) {
      const numReviews = Math.floor(Math.random() * 10);
      for (let i = 0; i < numReviews; i++) {
        await pool.query(
          'INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5)',
          [
            productId,
            faker.helpers.arrayElement(userIds),
            faker.number.int({ min: 1, max: 5 }),
            faker.lorem.sentence(),
            faker.date.recent({ days: 60 }),
          ]
        );
      }
    }

    console.log('✅ Seed con productos, categorías, vistas y reviews completada');
  } catch (err) {
    console.error('❌ Error al hacer seed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
})();
