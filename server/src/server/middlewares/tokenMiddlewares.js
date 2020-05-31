const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const CONSTANTS = require('../../constants');
const TokenError = require('../errors/TokenError');

const verifyJWT = promisify(jwt.verify);
const signJWT = promisify(jwt.sign);

module.exports.createAccessToken = async (req, res, next) => {
  try{
    const { user }=req;
    req.accessToken = await signJWT({
      firstName: user.firstName,
      userId: user.id,
      role: user.role,
      lastName: user.lastName,
      avatar: user.avatar,
      displayName: user.displayName,
      balance: user.balance,
      email: user.email,
      rating: user.rating,
    }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });
    next();
  }catch (err) {
    next(new TokenError(err));
  }
};

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
    next(new TokenError(err, 500));
  }
};

module.exports.verifyToken = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    req.tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    req.body.email=req.tokenData.email;
    next();
  } catch (err) {
    console.log('verifyToken');
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