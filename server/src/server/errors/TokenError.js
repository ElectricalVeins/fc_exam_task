const ApplicationError = require('./ApplicationError');

class TokenError extends ApplicationError {
  constructor(error, code) {
    super(error || { message:'Token error' }, code || 408);
  }
}

module.exports = TokenError;

