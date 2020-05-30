const ApplicationError = require('./ApplicationError');

class BankDeclineError extends ApplicationError {
  constructor(error) {
    super(error || { message: 'Bank decline transaction' }, 403);
  }
}

module.exports = BankDeclineError;
