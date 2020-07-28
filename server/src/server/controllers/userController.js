const moment = require('moment');
const uuid = require('uuid/v1');
const _ = require('lodash');
const CONSTANTS = require('../../constants');
const db = require('../models/index');
const { sendRestorePasswordEmail } = require('../utils/sendEmail');
const controller = require('../../socketInit');
const userQueries = require('./queries/userQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.sendUser = async (req, res, next) => {
  try {
    const { user: { firstName, lastName, role, id, displayName, balance, email, avatar } } = req;
    res.send({
      firstName,
      lastName,
      role,
      id,
      avatar,
      displayName,
      balance,
      email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.saveUserToken = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const { accessToken, user: { id } } = req;
    await userQueries.updateUser({ accessToken }, id, transaction);
    res.send({ token: accessToken });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.sendRestoreEmail = async (req, res, next) => {
  try {
    const { restorePassToken } = req;
    const restoreLink = `${CONSTANTS.BASE_URL}${CONSTANTS.PASSWORD_RESTORE_ROUTE}?token=${restorePassToken}`;
    sendRestorePasswordEmail(restoreLink, req.body.email);
    res.status(202).send('Check your email!');
  } catch (err) {
    next(err);
  }
};

function getQuery(offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () => ratingQueries.createRating({
    offerId,
    mark,
    userId,
  }, transaction);
  const getUpdateQuery = () => ratingQueries.updateRating({ mark },
    { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
  let sum = 0;
  let avg = 0;
  let transaction;
  try {
    const { body: { isFirst, offerId, mark, creatorId }, tokenData: { userId } } = req;
    transaction = await db.sequelize.transaction({ isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED });
    await getQuery(offerId, userId, mark, isFirst, transaction)();
    const offersArray = await db.Ratings.findAll({
      include: [
        {
          model: db.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ], transaction,
    });
    offersArray.forEach(offer => sum += offer.dataValues.mark);
    avg = sum / offersArray.length;
    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    await transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.createContests = async (req, res, next) => {
  try {
    const { body: { price, contests }, transaction, tokenData } = req;
    const orderId = uuid();

    contests.forEach((contest, index) => {
      const prize = index === contests.length - 1 ? Math.ceil(price / contests.length)
        : Math.floor(price / contests.length);

      _.merge(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId: tokenData.userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });
    });
    await db.Contests.bulkCreate(contests, transaction);
    await transaction.commit();
    res.status(200).send();
  } catch (err) {
    await req.transaction.rollback();
    next(err);
  }
};

module.exports.updateLostPassword = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const { userData: { hashPass, id } } = req;
    await userQueries.updateUser({ password: hashPass }, id, transaction);
    await transaction.commit();
    res.status(202).send('Your password have been successfully changed');
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    const { firstName, lastName, displayName, avatar, email, balance, role, id } = await userQueries.updateUser(req.body, req.tokenData.userId, transaction);
    await transaction.commit();
    res.send({ firstName, lastName, displayName, avatar, email, balance, role, id });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    const { body: { number, cvc, expiry, sum }, tokenData: { userId } } = req;
    transaction = await db.sequelize.transaction();
    const updatedUser = await userQueries.updateUser({ balance: db.sequelize.literal('balance - ' + sum) }, userId, transaction);
    await userQueries.makeCashout(number, cvc, expiry, sum, transaction);
    await transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
