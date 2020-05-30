const ApplicationError = require('./ApplicationError');

class DevAlreadyExistError extends ApplicationError {
  constructor(error) {
    super(error || { message:'Dev with this login already exist' }, 406);
  }
}

module.exports = DevAlreadyExistError;

