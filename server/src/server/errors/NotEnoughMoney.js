const ApplicationError = require('./ApplicationError');

class NotEnoughMoney extends ApplicationError {
  constructor(error) {
    super(error || { message:'Not enough money' }, 417);
  }
}

module.exports = NotEnoughMoney;

