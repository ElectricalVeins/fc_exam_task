const db = require('../models/index');
const CONSTANTS =require('../../constants');

module.exports.createWhereForAllContests = (types, contestId, industry, awardSort, status) => {
  const predicate={
    where: {},
    order: [],
  };
  if(types)
    Object.assign(predicate.where, { contestType: getPredicateTypes(types) });
  if(contestId)
    Object.assign(predicate.where, { id: contestId });
  if(industry)
    Object.assign(predicate.where, { industry });
  if(awardSort)
    predicate.order.push(['prize', awardSort]);
  Object.assign(predicate.where, { status: status || { [db.Sequelize.Op.or] : [CONSTANTS.CONTEST_STATUS_FINISHED, CONSTANTS.CONTEST_STATUS_ACTIVE] } });
  predicate.order.push(['id', 'desc']);
  return predicate;
};

function getPredicateTypes(types){
  return { [db.Sequelize.Op.or] : types };
}

module.exports.createWhereForOffers = (role, req, ownEntries, userId) => {
  const predicate={};

  if(role === CONSTANTS.CREATOR){
    predicate.userId = req.tokenData.userId;
  }else{
    predicate.status = { [db.Sequelize.Op.ne]: CONSTANTS.OFFER_STATUS_MODERATING };
  }
  if(ownEntries){
    predicate.userId = userId;
  }

  return predicate;
};
