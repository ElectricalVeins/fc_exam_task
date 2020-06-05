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
