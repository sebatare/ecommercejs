require('dotenv').config();
const app = require('./src/main');

if (require.main === module) {
    app.listen(3002, () => console.log('Servidor en http://localhost:3002'));
}