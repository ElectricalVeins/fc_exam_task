const bd = require('../models/index');
const CONSTANTS =require('../../constants');

module.exports.createWhereForAllContests=(typeIndex, contestId, industry, awardSort, status)=>{
  const predicate={
    where: {},
    order: [],
  };
  if(typeIndex)
    Object.assign(predicate.where, { contestType: getPredicateTypes(typeIndex) });
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

function getPredicateTypes(index){
  return { [bd.Sequelize.Op.or] : [types[index].split(',')] };
}

const types = ['', 'name,tagline,logo', 'name', 'tagline', 'logo', 'name,tagline', 'logo,tagline', 'name,logo'];
