const db = require('../models/index');
const bcrypt = require('bcrypt');
const CONSTANTS = require('../../constants');
const ServerError = require('../errors/ServerError');
const UncorrectPassword = require('../errors/UncorrectPassword');
const userQueries = require('../controllers/queries/userQueries');

module.exports.findInterlocutorById = async (req, res, next) => {
  try {
    const { query: { id } } = req;
    req.interlocutor = await userQueries.findUser({ id });
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmail = async (req, res, next) => {
  try {
    const { body: { email } } = req;
    req.user = await userQueries.findUser({ email });
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.findUserIdByContestId = async (req, res, next) => {
  try {
    const { body: { contestId } } = req;
    const { userId } = await db.Contests.findOne({
      where: { id: contestId },
      attributes: ['userId'],
    });
    if (!userId) {
      next(new ServerError('Owner of contest not found')); // <=========================================================
    }
    req.customerId = userId;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { body, hashPass } = req;
    req.user = await userQueries.userCreation(Object.assign(body, { password: hashPass }));
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.passwordCompare = async (req, res, next) => {
  try {
    const { body: { password: pass1 }, user: { password: pass2 } } = req;
    const passwordCompare = await bcrypt.compare(pass1, pass2);
    if (!passwordCompare) {
      throw new UncorrectPassword('Incorrect password or email');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.hashPass = async (req, res, next) => {
  try {
    req.hashPass = await bcrypt.hash(req.body.password, CONSTANTS.SALT_ROUNDS);
    next();
  }
  catch (err) {
    next(err);
  }
};

module.exports.makePayment = async (req, res, next) => {
  let transaction;
  try {
    const { body: { number, cvc, expiry, price, name } } = req;
    transaction = await db.sequelize.transaction();
    await userQueries.makePayment(number, cvc, expiry, price, name, transaction);
    req.transaction = transaction;
    next();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};
