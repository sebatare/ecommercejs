# Ejecutar TODOS los tests (unit + integration)
npm test

# Solo integration tests
npm run test:integration

# Solo unit tests
npm test -- tests/unit

# Solo CartService tests
npm test -- tests/unit/services/CartService.test.js

# Modo watch (se ejecutan al guardar)
npm test -- --watch

# Con más detalles
npm test -- --verbose

# Coverage (cuánto código está testeado)
npm test -- --coverage

# Unit tests en modo serial (no paralelo) y que se detenga al primer fallo

npm run test:unit -- --runInBand --bail