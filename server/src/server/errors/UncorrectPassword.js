const ApplicationError = require('./ApplicationError');

class UncorrectPassword extends ApplicationError {
  constructor(msg) {
    super(msg || 'Incorrect password', 403);
  }
}

module.exports = UncorrectPassword;

