const jwt = require('jsonwebtoken');

function createJwtForUser(user) {
  // user = { email, name, picture, sub, ... } de Google
  const payload = {
    email: user.email,
    name: user.name,
    picture: user.picture,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d', // ajusta según necesites
  });

  return token;
}

module.exports = { createJwtForUser };
