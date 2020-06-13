const db = require('../models/index');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const { createWhereForAllContests, createWhereForOffers } = require('../utils/createPredicate');
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
      return next(new ServerError('Can not get contest data'));
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
    next(err);
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
          where: req.tokenData.role === CONSTANTS.CREATOR ? { userId: req.tokenData.userId } : { status: { [db.Sequelize.Op.or]: [CONSTANTS.OFFER_STATUS_PENDING, CONSTANTS.OFFER_STATUS_REJECTED, CONSTANTS.OFFER_STATUS_WON] } },
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
    next(err);
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
  try {
    const{ contestId }=req;
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId: req.tokenData.userId,
    });
    res.send(updatedContest);
  } catch (err) {
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
          where: { status: { [db.Sequelize.Op.ne]: CONSTANTS.OFFER_STATUS_MODERATING } },
          attributes: ['id'],
        },
      ],
    });
    contests.forEach(contest => contest.dataValues.count = contest.dataValues.Offers.length);
    const haveMore = await isHaveMore(contests, req.body.limit);
    res.send({ contests, haveMore });
  }catch (err) {
    next(err);
  }
};

async function isHaveMore(contests, limit){
  return await contests.length > 0 && contests.length === limit;
}

module.exports.getContests = async (req, res, next) => {
  try{
    const { body:{ types, contestId, industry, awardSort, status, offset, limit, ownEntries }, tokenData:{ userId, role } }=req;
    const { where, order } = createWhereForAllContests(types, contestId, industry, awardSort, status);
    const whereForOffers = createWhereForOffers(role, req, ownEntries, userId);
    const contests = await db.Contests.findAll({
      where,
      order,
      limit,
      offset: offset ? offset : 0,
      include: [
        {
          model: db.Offers,
          required: ownEntries,
          where: whereForOffers,
          attributes: ['id'],
        }],
    });
    contests.forEach(contest => contest.dataValues.count = contest.dataValues.Offers.length);
    const haveMore = await isHaveMore(contests, limit);
    res.send({ contests, haveMore });
  }catch(err){
    next(err);
  }
};
