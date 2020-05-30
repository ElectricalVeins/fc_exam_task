const ApplicationError = require('./ApplicationError');

class BadRequestError extends ApplicationError {
  constructor(error) {
    super(error.message || 'Bad request', 400);
  }
}

module.exports = BadRequestError;
