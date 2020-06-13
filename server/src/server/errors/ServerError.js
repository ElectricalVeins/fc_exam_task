const ApplicationError = require('./ApplicationError');

class ServerError extends ApplicationError {
  constructor(message) {
    super(message || 'Server error', 500);
  }
}

module.exports = ServerError;
