// scripts/seed.js
require('dotenv').config();
const { Client } = require('pg');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const pool = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // ← Asegúrate de tener esta variable en .env
});

const categoryNames = [
  'Electrónica',
  'Ropa',
  'Hogar',
  'Libros',
  'Juguetes',
  'Deportes',
  'Belleza',
  'Alimentos'
];

(async () => {
  try {
    await pool.connect();
    console.log('🔗 Conectado a la base de datos de testing');

    // =====================================================
    // 1. LIMPIAR TODAS LAS TABLAS
    // =====================================================
    console.log('🧹 Limpiando base de datos...');
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
    console.log('✅ Base de datos limpiada');

    // =====================================================
    // 2. INSERTAR ROLES
    // =====================================================
    console.log('👥 Insertando roles...');
    await pool.query(`INSERT INTO roles (name) VALUES ('cliente'), ('admin')`);
    console.log('✅ Roles insertados');

    // =====================================================
    // 3. INSERTAR USUARIOS
    // =====================================================
    console.log('👤 Insertando usuarios...');

    // Usuario admin
    const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
    const adminRes = await pool.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Admin User', 'admin@test.com', hashedAdminPassword, 2]
    );
    const adminId = adminRes.rows[0].id;
    console.log(`✅ Admin creado (ID: ${adminId})`);

    // Usuario de prueba normal
    const hashedUserPassword = await bcrypt.hash('User123!', 10);
    const userRes = await pool.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Test User', 'user@test.com', hashedUserPassword, 1]
    );
    const testUserId = userRes.rows[0].id;
    console.log(`✅ Usuario de prueba creado (ID: ${testUserId})`);

    // Usuarios aleatorios adicionales
    const userIds = [adminId, testUserId];
    for (let i = 0; i < 10; i++) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const res = await pool.query(
        'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [
          faker.person.fullName(),
          faker.internet.email(),
          hashedPassword,
          1, // cliente
        ]
      );
      userIds.push(res.rows[0].id);
    }
    console.log(`✅ ${userIds.length} usuarios insertados en total`);

    // =====================================================
    // 4. INSERTAR CATEGORÍAS
    // =====================================================
    console.log('📁 Insertando categorías...');
    const categoryIds = [];
    for (const name of categoryNames) {
      const res = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id',
        [name]
      );
      categoryIds.push(res.rows[0].id);
    }
    console.log(`✅ ${categoryIds.length} categorías insertadas`);

    // =====================================================
    // 5. INSERTAR PRODUCTOS
    // =====================================================
    console.log('📦 Insertando productos...');
    const productIds = [];
    const insertProductQuery = `
      INSERT INTO products (name, description, price, stock, image_url, discount_percentage)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    for (let i = 0; i < 100; i++) {
      const price = parseFloat((Math.random() * 500 + 10).toFixed(2)); // Entre $10 y $510
      const stock = Math.floor(Math.random() * 100);
      const discount = Math.floor(Math.random() * 31); // 0-30%

      const prodRes = await pool.query(insertProductQuery, [
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        price,
        stock,
        `https://picsum.photos/seed/${i}/300/300`, // Imágenes reales de placeholder
        discount,
      ]);
      const productId = prodRes.rows[0].id;
      productIds.push(productId);

      // Vincular con 1-3 categorías aleatorias
      const shuffled = [...categoryIds].sort(() => 0.5 - Math.random());
      const numCategories = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3 categorías
      const selected = shuffled.slice(0, numCategories);

      for (const catId of selected) {
        await pool.query(
          'INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)',
          [productId, catId]
        );
      }
    }
    console.log(`✅ ${productIds.length} productos insertados`);

    // =====================================================
    // 6. INSERTAR VISTAS DE PRODUCTOS
    // =====================================================
    console.log('👁️  Insertando vistas de productos...');
    let totalViews = 0;
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
        totalViews++;
      }
    }
    console.log(`✅ ${totalViews} vistas insertadas`);

    // =====================================================
    // 7. INSERTAR REVIEWS DE PRODUCTOS
    // =====================================================
    console.log('⭐ Insertando reviews...');
    let totalReviews = 0;
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
        totalReviews++;
      }
    }
    console.log(`✅ ${totalReviews} reviews insertadas`);

    // =====================================================
    // 8. INSERTAR CARRITOS CON ITEMS (opcional)
    // =====================================================
    console.log('🛒 Insertando carritos de ejemplo...');
    let totalCartItems = 0;

    // Crear carrito para algunos usuarios
    for (const userId of userIds.slice(0, 5)) {
      const cartRes = await pool.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      const cartId = cartRes.rows[0].id;

      // Agregar 1-5 items aleatorios al carrito
      const numItems = Math.floor(Math.random() * 5) + 1;
      const selectedProducts = faker.helpers.arrayElements(productIds, numItems);

      for (const productId of selectedProducts) {
        await pool.query(
          'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
          [cartId, productId, Math.floor(Math.random() * 3) + 1]
        );
        totalCartItems++;
      }
    }
    console.log(`✅ ${totalCartItems} items de carrito insertados`);

    // =====================================================
    // RESUMEN FINAL
    // =====================================================
    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Resumen:`);
    console.log(`   • Usuarios: ${userIds.length}`);
    console.log(`   • Categorías: ${categoryIds.length}`);
    console.log(`   • Productos: ${productIds.length}`);
    console.log(`   • Vistas: ${totalViews}`);
    console.log(`   • Reviews: ${totalReviews}`);
    console.log(`   • Items en carritos: ${totalCartItems}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Credenciales de prueba:');
    console.log('   Admin:  admin@test.com / Admin123!');
    console.log('   User:   user@test.com / User123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Error al hacer seed:', err);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  }
})();