const ApplicationError = require('./ApplicationError');

class UncorrectPassword extends ApplicationError {
  constructor(error) {
    super(error || { message:'Incorrect password' }, 403);
  }
}

module.exports = UncorrectPassword;

