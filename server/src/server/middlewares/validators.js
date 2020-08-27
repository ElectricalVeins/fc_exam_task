const schems = require('../validationSchemes/schems');
const BadRequestError = require('../errors/BadRequestError');
const { validator } = require('../validationSchemes/validator');

module.exports.validateTimer = validator(schems.timer); 
module.exports.validateRegistrationData = validator(schems.registrationSchem);
module.exports.validateLogin = validator(schems.loginSchem);
module.exports.validatePasswordRestore = validator(schems.restorePassword);

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
