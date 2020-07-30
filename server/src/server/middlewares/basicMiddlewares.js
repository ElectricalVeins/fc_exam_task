const bd = require('../models/index');
const NotFound = require('../errors/UserNotFoundError');
const RightsError = require('../errors/RightsError');
const ServerError = require('../errors/ServerError');
const CONSTANTS = require('../../constants');


module.exports.parseBody = (req, res, next) => {
  req.body.contests = JSON.parse(req.body.contests);
  for (let i = 0; i < req.body.contests.length; i++) {
    if (req.body.contests[i].haveFile) {
      const file = req.files.splice(0, 1);
      req.body.contests[i].fileName = file[0].filename;
      req.body.contests[i].originalFileName = file[0].originalname;
    }
  }
  next();
};

module.exports.canGetContest = async (req, res, next) => {
  let result = null;
  try {
    if (req.tokenData.role === CONSTANTS.CUSTOMER) {
      result = await bd.Contests.findOne({
        where: { id: req.headers.contestid, userId: req.tokenData.userId },
      });
    } else if (req.tokenData.role === CONSTANTS.CREATOR) {
      result = await bd.Contests.findOne({
        where: {
          id: req.headers.contestid,
          status: { [bd.Sequelize.Op.or]: [CONSTANTS.CONTEST_STATUS_ACTIVE, CONSTANTS.CONTEST_STATUS_FINISHED] },
        },
      });
    }
    result ? next() : next(new RightsError('You can not get this contest'));
  } catch (err) {
    next(err);
  }
};

module.exports.onlyForCreative = async (req, res, next) => {
  if (req.tokenData.role !== CONSTANTS.CREATOR) {
    throw new RightsError('this page only for creatives');
  }
  else{
    next();
  }

};

module.exports.onlyForCustomer = async (req, res, next) => {
  if (req.tokenData.role !== CONSTANTS.CUSTOMER) {
    throw new RightsError('this page only for customers');
  }
  else{
    next();
  }

};

module.exports.canSendOffer = async (req, res, next) => {
  try {
    if (req.tokenData.role !== CONSTANTS.CREATOR) {
      throw new RightsError('this page only for creatives');
    }
    const result = await bd.Contests.findOne({
      where: {
        id: req.body.contestId,
      },
      attributes: ['status'],
    });
    if (result.get({ plain: true }).status === CONSTANTS.CONTEST_STATUS_ACTIVE) {
      next();
    } else {
      throw new RightsError('Rights Error.you cant send offer');
    }
  } catch (err) {
    next(err);
  }

};

module.exports.canModerateOffers = async (req, res, next) => {
  try{
    if(req.tokenData.role !== CONSTANTS.MODERATOR){
      throw new RightsError('Only for moderators');
    }
    next();
  }catch (err) {
    next(err);
  }
};

module.exports.onlyForCustomerWhoCreateContest = async (req, res, next) => {
  try {
    const result = await bd.Contests.findOne({
      where: { userId: req.tokenData.userId, id: req.body.contestId, status: CONSTANTS.CONTEST_STATUS_ACTIVE },
    });
    if (!result) {
      throw new RightsError('you are not the creator of this contest');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.canUpdateContest = async (req, res, next) => {
  try {
    const result = bd.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: { [bd.Sequelize.Op.not]: CONSTANTS.CONTEST_STATUS_FINISHED },
      },
    });
    if (!result) {
      throw new RightsError('Cant update contest');
    }
    next();
  } catch (err) {
    next(new ServerError(err));
  }
};

module.exports.checkUser = async (req, res, next) => {
  try {
    const { body: { email } } = req;

    const result = await bd.Users.findOne({
      where: { email },
    });
    if(!result) {
      throw new NotFound('User not found');
    }
    req.body.id = result.id;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.offerObjectCreator = async (req, res, next) => {
  const offer = {};
  try {
    const { body, tokenData } = req;
    offer.text = body.offerData;
    offer.userId = tokenData.userId;
    offer.contestId = body.contestId;

    if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
      const { file } = req;
      offer.fileName = file.filename;
      offer.originalFileName = file.originalname;
    }
    req.offer = offer;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.prepareOfferObjectToUpdate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.fileName = req.file.filename;
      req.body.originalFileName = req.file.originalname;
    }
    req.contestId = req.body.contestId;
    delete req.body.contestId;
    next();
  } catch (err) {
    next(err);
  }
};
