const { DatabaseError, ValidationError, UniqueConstraintError, ConnectionError } = require('sequelize');

module.exports = function (err, req, res, next) {
  if (err instanceof UniqueConstraintError) {
    return res.status(400).send(`Error: ${err.errors[0].message}. This ${err.errors[0].path} was already registered.`);
  }
  if (err instanceof ValidationError) {
    return res.status(400).send(`Error in field '${err.errors[0].path}'. ${err.errors[0].message}  `);
  }
  if (err instanceof ConnectionError) {
    return res.status(408).send('Temporary unavaiable');
  }
  if (err instanceof DatabaseError) {
    return res.status(400).send('transaction declined. check provided data');
  }
  next(err);
};
