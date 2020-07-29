const db = require('../../models/index');
const contestQueries = require('../../controllers/queries/contestQueries');
const userQueries = require('../../controllers/queries/userQueries');
const CONSTANTS = require('../../../constants');
const controller = require('../../../socketInit');
const ServerError = require('../../errors/ServerError');

const updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, [updatedOffer]] = await db.Offers.update(data, { where: predicate, returning: true, transaction });
  if (updatedCount !== 1){
    throw new ServerError('cannot update offer!');
  }
  else {
    return updatedOffer.dataValues;
  }
};

const updateOfferStatus = async (data, predicate, transaction) => {
  const [updatedOffersCount, updatedOffers] = await db.Offers.update(data, { where: predicate, returning: true, transaction });
  if (updatedOffersCount < 1) {
    throw new ServerError('can not update offer!');
  } else {
    return updatedOffers;
  }
};

const createOffer = async (data) => {
  const result = await db.Offers.create(data);
  if (!result){
    throw new ServerError('cannot create new Offer');
  }
  else{
    return result.get({ plain: true });
  }
};

const rejectOffer = async (offerId, creatorId, contestId, transaction) => {
  const rejectedOffer = await updateOffer({ status: CONSTANTS.OFFER_STATUS_REJECTED }, { id: offerId }, transaction);
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of yours offers was rejected', contestId);
  return rejectedOffer;
};

const resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
  const finishedContest = await contestQueries.updateContestStatus({
    status: db.sequelize.literal(`   CASE
              WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
              WHEN "orderId"='${orderId}' AND "priority"=${priority + 1}  THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}'
              WHEN "orderId"='${orderId}' AND "priority"<${priority}  THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
              ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
              END
      `),
  }, { orderId }, transaction);
  await userQueries.updateUser({ balance: db.sequelize.literal('balance + ' + finishedContest.prize) }, creatorId, transaction);
  const updatedOffers = await updateOfferStatus({
    status: db.sequelize.literal(` CASE
              WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'
              WHEN "status"='${CONSTANTS.OFFER_STATUS_BANNED}' THEN '${CONSTANTS.OFFER_STATUS_BANNED}'
              ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
              END
      `),
  }, {
    contestId,
  }, transaction);

  const arrayRoomsId = [];
  let resolvedOfferIndex;
  updatedOffers.forEach((offer, index) => {
    if (offer.status === CONSTANTS.OFFER_STATUS_REJECTED && creatorId !== offer.userId) {
      arrayRoomsId.push(offer.userId);
    }
    if(offer.status === CONSTANTS.OFFER_STATUS_WON){
      resolvedOfferIndex = index;
    }
  });
  controller.getNotificationController().emitChangeOfferStatus(arrayRoomsId, 'Someone of yours offers was rejected', contestId);
  controller.getNotificationController().emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);
  return updatedOffers[resolvedOfferIndex].dataValues;
};

module.exports = {
  resolveOffer,
  rejectOffer,
  createOffer,
  updateOfferStatus,
  updateOffer,
};
