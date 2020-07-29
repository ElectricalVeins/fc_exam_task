const schems = require('../validationSchemes/schems');
const BadRequestError = require('../errors/BadRequestError');

module.exports.validateRegistrationData = async (req, res, next) => {
  try {
    await schems.registrationSchem.validate(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.validateLogin = async (req, res, next) => {
  try {
    await schems.loginSchem.validate(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.validatePasswordRestore = async (req, res, next) => {
  try {
    await schems.restorePassword.validate(req.body);
    next();
  } catch (err) {
    next(err);
  }
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
          throw new BadRequestError('Invalid Data Provided');
        }
      });
      next();
    })
    .catch(err => {
      next(err);
    });
};

module.exports.validateTimer = async (req, res, next) => {
  try {
    await schems.timer.validate(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
