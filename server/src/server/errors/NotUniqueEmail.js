const ApplicationError = require('./ApplicationError');

class NotUniqueEmail extends ApplicationError {
  constructor(error) {
    super(error || { message:'This email already exists' }, 409);
  }
}

module.exports = NotUniqueEmail;
