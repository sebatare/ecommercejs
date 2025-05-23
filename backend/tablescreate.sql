--RELACIONES UNO A MUCHO
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role_id INT REFERENCES roles(id)
);



CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'open' -- open, paid, cancelled
);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    total NUMERIC(10, 2) NOT NULL
);

--RELACIONES MUCHO A MUCHO

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    price NUMERIC(10, 2),
    stock INT,
    image_url TEXT
);

CREATE TABLE cart_items (
    cart_id INT REFERENCES carts(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1,
    PRIMARY KEY (cart_id, product_id)
);


CREATE TABLE order_items (
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    price NUMERIC(10, 2),
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE wishlist (
    user_id INT REFERENCES users(id),
    product_id INT REFERENCES products(id),
    PRIMARY KEY (user_id, product_id)
);


CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE product_categories (
    product_id INT REFERENCES products(id),
    category_id INT REFERENCES categories(id),
    PRIMARY KEY (product_id, category_id)
);

-- RELACIONES UNO A UNO

CREATE TABLE profiles (
    user_id INT PRIMARY KEY REFERENCES users(id),
    address TEXT,
    avatar_url TEXT
);

