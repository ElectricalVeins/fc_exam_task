const ApplicationError = require('./ApplicationError');

class ServerError extends ApplicationError {
  constructor(error) {
    super(error || { message:'Server error' }, 500);
  }
}

module.exports = ServerError;
