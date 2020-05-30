const ApplicationError = require('./ApplicationError');

class RightsError extends ApplicationError {
  constructor(error) {
    super(error || { message:'not enough rights' }, 423);
  }
}

module.exports = RightsError;
