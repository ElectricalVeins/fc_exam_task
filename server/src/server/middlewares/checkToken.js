const jwt = require('jsonwebtoken');
const CONSTANTS = require('../../constants');
const TokenError = require('../errors/TokenError');
import userQueries from '../controllers/queries/userQueries';
const { promisify }= require('util');

const verifyJWT = promisify(jwt.verify);


module.exports.checkAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });
    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
  } catch (err) {
    next(new TokenError(err));
  }
};

module.exports.checkToken = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    req.tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    next();
  } catch (err) {
    next(new TokenError(err));
  }
};

module.exports.verifyRestorePasswordToken = async (req, res, next) => {
  try {
    const { body: { token } } = req;
    req.userData = await verifyJWT(token, CONSTANTS.JWT_SECRET);
    next();
  } catch (err) {
    next(new TokenError(err, 400));
  }
};
