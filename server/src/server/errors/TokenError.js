const ApplicationError = require('./ApplicationError');

class TokenError extends ApplicationError {
  constructor(message, code) {
    super(message || 'Token error', code || 408);
  }
}

module.exports = TokenError;
