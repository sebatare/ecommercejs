const express = require('express');
const cors = require('cors');


const errorHandler = require('./middleware/errorHandler');
const authenticate = require('./middleware/authenticate');


// Services & repos
const ProductService = require('./application/services/ProductService');
const ProductRepository = require('./infrastructure/repositories/ProductRepository');
const AuthService = require('./application/services/AuthService');
const UserRepository = require('./infrastructure/repositories/UserRepository');
const RoleService = require('./application/services/RoleService');
const RoleRepository = require('./infrastructure/repositories/RoleRepository');
const CategoryRepository = require('./infrastructure/repositories/CategoryRepository');
const CartService = require('./application/services/CartService');
const CartRepository = require('./infrastructure/repositories/CartRepository');

// Routers
const createProductRouter = require('./infrastructure/routers/ProductRouter');
const createAuthRouter = require('./infrastructure/routers/AuthRouter');
const createUserRouter = require('./infrastructure/routers/UserRouter');
const createRoleRouter = require('./infrastructure/routers/RoleRouter');
const createCategoryRouter = require('./infrastructure/routers/CategoryRouter');
const createCartRouter = require('./infrastructure/routers/CartRouter');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(require('cookie-parser')());
app.use(express.json());



// Dependency injection
app.use('/api/products', createProductRouter(
  new ProductService(new ProductRepository())
));

app.use('/api/auth', createAuthRouter(
  new AuthService(new UserRepository(), new CartRepository())
));

app.use('/api/users', createUserRouter(
  new UserRepository()
));

app.use('/api/roles', createRoleRouter(
  new RoleService(new RoleRepository())
));

app.use('/api/categories', createCategoryRouter(
  new CategoryRepository()
));

app.use(
  '/api/cart',
  authenticate,
  createCartRouter(new CartService(new CartRepository()))
);

app.use(errorHandler);

module.exports = app;
