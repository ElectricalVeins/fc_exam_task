const db = require('../models/index');
const offerQueries = require('./queries/offerQueries');
const controller = require('../../socketInit');
const CONSTANTS = require('../../constants');
const { sendOfferModerationEmail } = require('../utils/sendEmail');

module.exports.setNewOffer = async (req, res, next) => {
  try {
    const { offer, tokenData } = req;
    const result = await offerQueries.createOffer(offer);
    delete result.contestId;
    delete result.userId;
    const User = Object.assign({}, req.tokenData, { id: tokenData.userId });
    res.send(Object.assign({}, result, { User }));
  } catch (err) {
    return next(err);
  }
};

module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  let offer;
  try {
    const { body: { command, priority, offerId, orderId, creatorId, contestId } } = req;
    transaction = await db.sequelize.transaction();

    switch (command) {
    case CONSTANTS.OFFER_COMMAND_REJECT: {
      offer = await offerQueries.rejectOffer(offerId, creatorId, contestId, transaction);
      break;
    }
    case CONSTANTS.OFFER_COMMAND_RESOLVE: {
      offer = await offerQueries.resolveOffer(contestId, creatorId, orderId, offerId, priority, transaction);
      break;
    }
    }
    transaction.commit();
    res.send(offer);
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.getAllUnModeratedOffers = async (req, res, next) => {
  try {
    const { query: { offset } } = req;
    const offers = await db.Offers.findAll({
      where: {
        status: CONSTANTS.OFFER_STATUS_MODERATING,
      },
      include: [{
        model: db.Users,
        required: true,
        attributes: ['displayName', 'email'],
      },
      ],
      limit: 8,
      offset: offset || 0,
      order: [['id', 'ASC']],
    });
    res.send(offers);
  } catch (err) {
    next(err);
  }
};

module.exports.offerModeration = async (req, res, next) => {
  let transaction;
  let updatedOffer;
  try{
    const { body: { command, offerId: id, userEmail, creatorId, contestId }, customerId } = req;
    transaction = await db.sequelize.transaction();

    if(command === CONSTANTS.OFFER_COMMAND_APPROVE){
      updatedOffer = await offerQueries.updateOffer({ status:CONSTANTS.OFFER_STATUS_PENDING }, { id }, transaction);
      controller.getNotificationController().emitEntryCreated(customerId);
    }

    if(command === CONSTANTS.OFFER_COMMAND_BAN){
      updatedOffer = await offerQueries.updateOffer({ status:CONSTANTS.OFFER_STATUS_BANNED }, { id }, transaction);
      controller.getNotificationController().emitChangeOfferStatus(creatorId, 'One of your offer was banned!', contestId);
    }

    transaction.commit();
    sendOfferModerationEmail(updatedOffer, userEmail);
    res.send(updatedOffer);
  }catch (err) {
    transaction.rollback();
    next(err);
  }
};
