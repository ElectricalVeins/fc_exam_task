const db = require('../../models/index');
const contestQueries = require('../../controllers/queries/contestQueries');
const userQueries = require('../../controllers/queries/userQueries');
const CONSTANTS = require('../../../constants');
const controller = require('../../../socketInit');
const ServerError = require('../../errors/ServerError');


module.exports.updateContest = async (data, predicate, transaction) => {
  const [updatedCount, [updatedContest]] = await db.Contests.update(data, { where: predicate, returning: true, transaction });
  if (updatedCount !== 1){
    throw new ServerError(new Error('cannot update Contest'));
  }
  else{
    return updatedContest.dataValues;
  }
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
  const updateResult = await db.Contests.update(data, { where: predicate, returning: true, transaction });
  if (updateResult[0]<1){
    throw new ServerError(new Error('cannot update Contest'));
  }
  else
    return updateResult[1][0].dataValues;
};

module.exports.updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, [updatedOffer]] = await db.Offers.update(data, { where: predicate, returning: true, transaction });
  if (updatedCount !==1){
    throw new ServerError(new Error('cannot update offer!'));
  }
  else {
    return updatedOffer.dataValues;
  }
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
  const [updatedOffersCount, updatedOffers] = await db.Offers.update(data, { where: predicate, returning: true, transaction });
  if (updatedOffersCount < 1) {
    throw new ServerError(new Error('can not update offer!'));
  } else {
    return updatedOffers;
  }
};

module.exports.createOffer = async (data) => {
  const result = await db.Offers.create(data);
  if (!result){
    throw new ServerError(new Error('cannot create new Offer'));
  }
  else{
    return result.get({ plain: true });
  }
};

module.exports.rejectOffer = async (offerId, creatorId, contestId, transaction) => {
  const rejectedOffer = await contestQueries.updateOffer({ status: CONSTANTS.OFFER_STATUS_REJECTED }, { id: offerId }, transaction);
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of yours offers was rejected', contestId);
  return rejectedOffer;
};

module.exports.resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
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

  const arrayRoomsId = [];
  updatedOffers.forEach(offer => {
    if (offer.status === CONSTANTS.OFFER_STATUS_REJECTED && creatorId !== offer.userId) {
      arrayRoomsId.push(offer.userId);
    }
  });
  controller.getNotificationController().emitChangeOfferStatus(arrayRoomsId, 'Someone of yours offers was rejected', contestId);
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);
  return updatedOffers[0].dataValues;
};
/*
async function approveOffer (){}
async function banOffer (){}
*/
