const ApplicationErrorHandler = require('../../errors/ApplicationError');
const UncorrectPassword = require('../../errors/UncorrectPassword');


module.exports = function (err, req, res, next) {
  if (err instanceof ApplicationErrorHandler) {
    return res.status(err.status).send(err.message);
  }
  if(err instanceof UncorrectPassword){
    return res.status(err.status).send(err.message);
  }
  if (err.message === 'new row for relation "Banks" violates check constraint "Banks_balance_ck"' || err.message === 'new row for relation "Users" violates check constraint "Users_balance_ck"') {
    err.message = 'Not Enough money';
    err.code = 402;
    return res.status(err.status).send(err.message);
  }
  next(err);
};
