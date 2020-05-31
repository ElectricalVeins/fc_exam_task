const schems = require('../validationSchemes/schems');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.validateRegistrationData = async (req, res, next) => {
  const validationResult = await schems.registrationSchem.isValid(req.body);
  if (!validationResult) {
    return next(new BadRequestError(new Error('Invalid data for registration')));
  } else {
    next();
  }
};

module.exports.validateLogin = async (req, res, next) => {
  const validationResult = await schems.loginSchem.isValid(req.body);
  if (validationResult) {
    next();
  } else {
    return next(new BadRequestError(new Error('Invalid data for login')));
  }
};

module.exports.validatePasswordRestore = async (req, res, next) => {
  const result = await schems.restorePassword.isValid(req.body);

  result
    ? next()
    : next(new BadRequestError(new Error('Invalid data for password restore')));
};

module.exports.validateContestCreation = (req, res, next) => {
  const promiseArray = [];
  req.body.contests.forEach(el => {
    promiseArray.push(schems.contestSchem.isValid(el));
  });
  return Promise.all(promiseArray)
    .then(results => {
      results.forEach(result => {
        if (!result) {
          return next(new BadRequestError(new Error('Invalid Data Provided')));
        }
      });
      next();
    })
    .catch(err => {
      next(err);
    });
};
