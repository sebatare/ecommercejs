// domain/errors/auth/InvalidPasswordError.js
class InvalidPasswordError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'InvalidPasswordError';
    this.code = code;
    this.statusCode = 400;
  }
}

module.exports = InvalidPasswordError;
