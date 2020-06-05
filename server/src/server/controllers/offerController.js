const db = require('../models/index');
const ServerError = require('../errors/ServerError');
const offerQueries = require('./queries/offerQueries');
const controller = require('../../socketInit');
const CONSTANTS = require('../../constants');

module.exports.setNewOffer = async (req, res, next) => {
  try {
    const { offer, body, tokenData }=req;
    const result = await offerQueries.createOffer(offer);
    delete result.contestId;
    delete result.userId;
    controller.getNotificationController().emitEntryCreated(body.customerId);
    //controller.getNotificationController().offerWillBeModerated();
    const User = Object.assign({}, req.tokenData, { id: tokenData.userId });
    res.send(Object.assign({}, result, { User }));
  } catch (err) {
    return next(new ServerError(err));
  }
};

module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  let offer;
  try{
    const { body:{ command } }=req;
    transaction = await db.sequelize.transaction();

    switch (command) {
      case CONSTANTS.OFFER_COMMAND_REJECT:{
        offer = await offerQueries.rejectOffer(req.body.offerId, req.body.creatorId, req.body.contestId, transaction);
        break;
      }
      case CONSTANTS.OFFER_COMMAND_RESOLVE:{
        offer = await offerQueries.resolveOffer(req.body.contestId, req.body.creatorId, req.body.orderId, req.body.offerId, req.body.priority, transaction);
        break;
      }
    }
    transaction.commit();
    res.send(offer);
  }catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.getAllUnModeratedOffers = async (req, res, next) => {
  try {
    //const {body:{{offset}}} = req
    const offers = db.Offers.findAll({
      where:{
        status: CONSTANTS.OFFER_STATUS_MODERATING
      },
      //limit: 4,
      //offset: req.body.offset,
    }).get({ plain: true });

    console.log(offers)

    res.send()
  }catch (err) {
    next(new ServerError(err))
  }
};
