const bcrypt = require('bcrypt');
const CONSTANTS = require('../../constants');
const NotFound = require('../errors/UserNotFoundError');
const ServerError = require('../errors/ServerError');
const UncorrectPassword = require('../errors/UncorrectPassword');
const NotEnoughMoney = require('../errors/NotEnoughMoney');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const userQueries = require('../controllers/queries/userQueries');

module.exports.findUserByEmail = async (req, res, next) => {
  try {
    const { body: { email } } = req;
    req.user = await userQueries.findUser({ email });
    next();
  } catch (err) {
    next(new NotFound(err));
  }
};

module.exports.createUser = async (req, res, next) => {
  try{
    const { body, hashPass } = req;
    req.user = await userQueries.userCreation(Object.assign(body, { password: hashPass }));
    next();
  }catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail(err));
    } else {
      next(new ServerError(err));
    }
  }
};

module.exports.passwordCompare = async (req, res, next) => {
  try {
    const { body: { password: pass1 }, user: { password: pass2 } } = req;
    const passwordCompare = await bcrypt.compare(pass1, pass2);
    if (!passwordCompare) {
      next(new UncorrectPassword(new Error('Incorrect password or email')));
    }
    next();
  } catch (err) {
    next(new UncorrectPassword(err));
  }
};

module.exports.hashPass = async (req, res, next) => {
  try{
    req.hashPass=await bcrypt.hash(req.body.password, CONSTANTS.SALT_ROUNDS);
    next();
  }
  catch(err){
    next(new ServerError(err));
  }
};
