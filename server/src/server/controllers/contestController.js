const db = require('../models/index');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../../socketInit');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../../constants');


module.exports.dataForContest = async (req, res, next) => {
  const response = {};
  try {
    const characteristics = await db.ContestType.findAll({
      include: [{
        model: db.ContestDescribe,
        required: true,
        attributes:['describe'],
      }],
      where: {
        type: [req.body.characteristic1, req.body.characteristic2, 'industry'],
      },
    });
    if (!characteristics) {
      return next(new ServerError(new Error('Can not get contest data')));
    }
    for (const characteristic of characteristics) {
      const { type, ContestDescribes } = characteristic;
      if (!response[type]) {
        response[type] = [];
      }
      ContestDescribes.forEach(describeItem => {
        response[type].push(describeItem.describe);
      });
    }
    res.send(response);
  } catch (err) {
    next(new ServerError(err));
  }
};

module.exports.getContestById = async (req, res, next) => {
  try {
    let contestInfo = await db.Contests.findOne({
      where: { id: req.headers.contestid },
      order: [
        [db.Offers, 'id', 'asc'],
      ],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: { exclude: ['password', 'role', 'balance', 'accessToken'] },
        },
        {
          model: db.Offers,
          required: false,
          where: req.tokenData.role === CONSTANTS.CREATOR ? { userId: req.tokenData.userId } : {},
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: { exclude: ['password', 'role', 'balance', 'accessToken'] },
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId: req.tokenData.userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });
    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach(offer => {
      if (offer.Rating) {
        offer.mark = offer.Rating.mark;
      }
      delete offer.Rating;
    });
    res.send(contestInfo);
  } catch (err) {
    next(new ServerError(err));
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
  if (req.file) {
    req.body.fileName = req.file.filename;
    req.body.originalFileName = req.file.originalname;
  }
  const contestId = req.body.contestId;
  delete req.body.contestId;
  try {
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId: req.tokenData.userId,
    });
    res.send(updatedContest);
  } catch (err) {
    next(err);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const offer = {};
  if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
    offer.fileName = req.file.filename;
    offer.originalFileName = req.file.originalname;
  } else {
    offer.text = req.body.offerData;
  }
  offer.userId = req.tokenData.userId;
  offer.contestId = req.body.contestId;
  try {
    const result = await contestQueries.createOffer(offer);
    delete result.contestId;
    delete result.userId;
    controller.getNotificationController().emitEntryCreated(req.body.customerId);
    const User = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.send(Object.assign({}, result, { User }));
  } catch (err) {
    return next(new ServerError(err));
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer({ status: CONSTANTS.OFFER_STATUS_REJECTED }, { id: offerId });
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of yours offers was rejected', contestId);
  return rejectedOffer;
};

const resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
  const finishedContest = await contestQueries.updateContestStatus({
    status: db.sequelize.literal(`   CASE
            WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
            WHEN "orderId"='${orderId}' AND "priority"=${priority + 1}  THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}'
            ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
            END
    `),
  }, { orderId }, transaction);
  await userQueries.updateUser({ balance: db.sequelize.literal('balance + ' + finishedContest.prize) }, creatorId, transaction);
  const updatedOffers = await contestQueries.updateOfferStatus({
    status: db.sequelize.literal(` CASE
            WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'
            ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
            END
    `),
  }, {
    contestId,
  }, transaction);
  transaction.commit();
  const arrayRoomsId = [];
  updatedOffers.forEach(offer => {
    if (offer.status === CONSTANTS.OFFER_STATUS_REJECTED && creatorId!==offer.userId) {
      arrayRoomsId.push(offer.userId);
    }
  });
  controller.getNotificationController().emitChangeOfferStatus(arrayRoomsId, 'Someone of yours offers was rejected', contestId);
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);
  return updatedOffers[0].dataValues;
};

module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  if (req.body.command === 'reject') {
    try {
      const offer = await rejectOffer(req.body.offerId, req.body.creatorId, req.body.contestId);
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (req.body.command === 'resolve')
    try {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(req.body.contestId, req.body.creatorId, req.body.orderId, req.body.offerId, req.body.priority, transaction);
      res.send(winningOffer);
    } catch (err) {
      transaction.rollback();
      next(err);
    }
};

module.exports.getCustomersContests = async (req, res, next) => {
  try{
    const contests = await db.Contests.findAll({
      where: { status: req.headers.status, userId: req.tokenData.userId },
      limit: req.body.limit,
      offset: req.body.offset ? req.body.offset : 0,
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Offers,
          required: false,
          attributes: ['id'],
        },
      ],
    });
    contests.forEach(contest => contest.dataValues.count = contest.dataValues.Offers.length);
    const haveMore =isHaveMore(contests, req.body.limit)
    res.send({ contests, haveMore });
  }catch (err) {
    next(new ServerError(err));
  }
};

function isHaveMore(contests, limit){
  return contests.length > 0 && contests.length === limit
}

module.exports.getContests = async (req, res, next) => {
  try{
    const { body:{ types, contestId, industry, awardSort, status } }=req;
    const predicates = UtilFunctions.createWhereForAllContests(types, contestId, industry, awardSort, status);
    const contests = await db.Contests.findAll({
      where: predicates.where,
      order: predicates.order,
      limit: req.body.limit,
      offset: req.body.offset ? req.body.offset : 0,
      include: [
        {
          model: db.Offers,
          required: req.body.ownEntries,
          where: req.body.ownEntries ? { userId: req.tokenData.userId } : {},
          attributes: ['id'],
        }],
    });
    contests.forEach(contest => contest.dataValues.count = contest.dataValues.Offers.length);
    const haveMore =isHaveMore(contests, req.body.limit)
    res.send({ contests, haveMore });
  }catch(err){
    next(new ServerError(err));
  }
};
