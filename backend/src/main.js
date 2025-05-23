const express = require('express');
const cors = require('cors');

const ProductService = require('./application/services/ProductService');
const ProductRepository = require('./infrastructure/repositories/ProductRepository');
const createProductRouter = require('./infrastructure/routers/ProductRouter');

const AuthService = require('./application/services/AuthService');
const UserRepository = require('./infrastructure/repositories/UserRepository');
const authenticate = require('./middleware/authenticate');
const createAuthRouter = require('./infrastructure/routers/AuthRouter');
const createUserRouter = require('./infrastructure/routers/UserRouter');

const RoleService = require('./application/services/RoleService');
const RoleRepository = require('./infrastructure/repositories/RoleRepository');
const createRoleRouter = require('./infrastructure/routers/RoleRouter');

// CART INJECTION

const CartService = require('./application/services/CartService');
const CartRepository = require('./infrastructure/repositories/CartRepository');

const createCartRouter = require('./infrastructure/routers/CartRouter');


const app = express();
app.use(cors());
app.use(express.json());


const productService = new ProductService(new ProductRepository());
app.use('/api/products', authenticate, createProductRouter(productService));

const authService = new AuthService(new UserRepository());
app.use('/api/auth', createAuthRouter(authService));

const userRepository = new UserRepository();
app.use('/api/users', createUserRouter(userRepository));

const roleService = new RoleService(new RoleRepository());
app.use('/api/roles', createRoleRouter(roleService));

const cartService = new CartService(new CartRepository());
app.use('/api/cart', authenticate, createCartRouter(cartService));

app.listen(3001, () => console.log('Servidor en http://localhost:3001'));
