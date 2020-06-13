const ApplicationError = require('./ApplicationError');

class NotUniqueEmail extends ApplicationError {
  constructor(message) {
    message = 'This email already exists';
    super(message, 409);
  }
}

module.exports = NotUniqueEmail;
