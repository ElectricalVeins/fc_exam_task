const bd = require('../models/index');
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
  Object.assign(predicate.where, { status: status || { [bd.Sequelize.Op.or] : [CONSTANTS.CONTEST_STATUS_FINISHED, CONSTANTS.CONTEST_STATUS_ACTIVE] } });
  predicate.order.push(['id', 'desc']);
  return predicate;
};

function getPredicateTypes(types){
  return { [bd.Sequelize.Op.or] : types };
}
