const jwt = require('jsonwebtoken');
const CONSTANTS = require('../../constants');
const TokenError = require('../errors/TokenError');
const { promisify } = require('util');

const signJWT = promisify(jwt.sign);

module.exports.createRestorePassToken = async (req, res, next) => {
  try {
    const { body: { email }, hashPass } = req;

    req.restorePassToken = await signJWT({
      email,
      hashPass,
    }, CONSTANTS.JWT_SECRET, {
      expiresIn: CONSTANTS.ACCESS_TOKEN_TIME,
    });

    next();
  } catch (err) {
    next(new TokenError('Error on token sign', 500));
  }
};
