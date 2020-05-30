const ApplicationError = require('./ApplicationError');

class UserNotFoundError extends ApplicationError {
  constructor(error) {
    super(error || { message:'User with this email is not found' }, 404);
  }
}


module.exports = UserNotFoundError;
