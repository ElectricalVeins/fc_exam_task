const ApplicationError = require('./ApplicationError');

class NotUniqueEmail extends ApplicationError {
  constructor(error) {
    error.message = 'This email already exists'
    super(error, 409);
  }
}

module.exports = NotUniqueEmail;
