const moment = require('moment');
const uuid = require('uuid/v1');
const _ = require('lodash');
const CONSTANTS = require('../../constants');
const db = require('../models/index');
const NotFound = require('../errors/UserNotFoundError');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotEnoughMoney = require('../errors/NotEnoughMoney');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const { sendRestorePasswordEmail } = require('../utils/sendEmail');
const controller = require('../../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.sendUser = async (req, res, next) => {
  try {
    const { user } = req;
    res.send({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user.id,
      avatar: user.avatar ? user.avatar : undefined,
      displayName: user.displayName,
      balance: user.balance,
      email: user.email,
    });
  } catch (err) {
    next(new ServerError(err));
  }
};

module.exports.saveUserToken = async (req, res, next) => {
  let transaction;
  try{
    transaction = await db.sequelize.transaction();
    const { accessToken, user:{ id } }=req;
    await userQueries.updateUser({ accessToken }, id, transaction);
    res.send({ token: accessToken });
    transaction.commit();
  }catch(err){
    transaction.rollback();
    next(new ServerError(err));
  }
};

module.exports.sendRestoreEmail = async (req, res, next) => {
  try{
    const { restorePassToken } = req;
    const restoreLink = `${CONSTANTS.BASE_URL}${CONSTANTS.PASSWORD_RESTORE_ROUTE}?token=${restorePassToken}`;
    await sendRestorePasswordEmail(restoreLink, req.body.email);
    res.status(202).send('Check your email!');
  }catch (err) {
    next(new ServerError(err));
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
    const { body:{ isFirst, offerId, mark, creatorId }, tokenData:{ userId } } = req;
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
    transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(new ServerError(err));
  }
};

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    await bankQueries.updateBankBalance({
      balance: db.sequelize.literal(`
                CASE
            WHEN "cardNumber"='${req.body.number.replace(/ /g, '')}' AND "cvc"='${req.body.cvc}' AND "expiry"='${req.body.expiry}' AND "name"='${req.body.name}'
                THEN "balance"-${req.body.price}
            WHEN "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}' AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' AND "name"='${CONSTANTS.SQUADHELP_BANK_NAME}'
                THEN "balance"+${req.body.price} END
        `),
    }, {
      cardNumber: { [db.sequelize.Op.in]: [CONSTANTS.SQUADHELP_BANK_NUMBER, req.body.number.replace(/ /g, '')] },
    }, transaction);

    const orderId = uuid();

    req.body.contests.forEach((contest, index) => {
      const prize = index === req.body.contests.length - 1 ? Math.ceil(req.body.price / req.body.contests.length)
        : Math.floor(req.body.price / req.body.contests.length);

      _.merge(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId: req.tokenData.userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });

    });
    await db.Contests.bulkCreate(req.body.contests, transaction);
    transaction.commit();
    res.status(200).send();
  } catch (err) {
    transaction.rollback();
    next(new ServerError(err));
  }
};

module.exports.updateLostPassword = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const { userData: { hashPass, id } } = req;
    await userQueries.updateUser({ password: hashPass }, id, transaction);
    transaction.commit();
    res.status(202).send('Your password have been successfully  changed');
  } catch (err) {
    transaction.rollback();
    next(new ServerError(err));
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
    transaction.commit();
    res.send({ firstName, lastName, displayName, avatar, email, balance, role, id });
  } catch (err) {
    transaction.rollback();
    next(new ServerError(err));
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const updatedUser = await userQueries.updateUser({ balance: db.sequelize.literal('balance - ' + req.body.sum) }, req.tokenData.userId, transaction);
    await bankQueries.updateBankBalance({
      balance: db.sequelize.literal(`CASE 
                WHEN "cardNumber"='${req.body.number.replace(/ /g, '')}' AND "expiry"='${req.body.expiry}' AND "cvc"='${req.body.cvc}'
                    THEN "balance"+${req.body.sum}
                WHEN "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}'
                    THEN "balance"-${req.body.sum}
                 END
                `),
    },
    {
      cardNumber: [CONSTANTS.SQUADHELP_BANK_NUMBER, req.body.number.replace(/ /g, '')],
    },
    transaction);
    transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    transaction.rollback();
    next(new ServerError(err));
  }
};
