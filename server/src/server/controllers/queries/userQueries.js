const db = require('../../models/index');
const bankQueries = require('./bankQueries');
const CONSTANTS = require('../../../constants');
const NotFound = require('../../errors/UserNotFoundError');
const ServerError = require('../../errors/ServerError');


module.exports.updateUser = async (data, id, transaction) => {
  const [updatedCount, [updatedUser]] = await db.Users.update(data, { where: { id }, returning: true }, transaction);
  if (updatedCount !== 1) {
    throw new ServerError('cannot update user');
  }
  return updatedUser.dataValues;
};

module.exports.findUser = async (predicate, transaction) => {
  const foundUser = await db.Users.findOne({ where: predicate }, transaction);
  if (!foundUser) {
    throw new NotFound('user with this data does not exist');
  }
  else {
    return foundUser.get({ plain: true });
  }
};

module.exports.userCreation = async (data) => {
  const newUser = await db.Users.create(data);
  if (!newUser) {
    throw new ServerError('server error on user creation');
  }
  else {
    return newUser.get({ plain: true });
  }
};

module.exports.makePayment = async (cardNumber, cvc, expiry, price, name, transaction) => {
  await bankQueries.updateBankBalance({
    balance: db.sequelize.literal(`
              CASE
          WHEN "cardNumber"='${cardNumber.replace(/ /g, '')}' AND "cvc"='${cvc}' AND "expiry"='${expiry}' AND "name"='${name}'
              THEN "balance"-${price}
          WHEN "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}' AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' AND "name"='${CONSTANTS.SQUADHELP_BANK_NAME}'
              THEN "balance"+${price} END
      `),
  }, {
    cardNumber: { [db.sequelize.Op.in]: [CONSTANTS.SQUADHELP_BANK_NUMBER, cardNumber.replace(/ /g, '')] },
  }, transaction);
};

module.exports.makeCashout = async (cardNumber, cvc, expiry, sum, transaction) => {
  await bankQueries.updateBankBalance({
    balance: db.sequelize.literal(`CASE 
                WHEN "cardNumber"='${cardNumber.replace(/ /g, '')}' AND "expiry"='${expiry}' AND "cvc"='${cvc}'
                    THEN "balance"+${sum}
                WHEN "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}'
                    THEN "balance"-${sum}
                 END
                `),
  }, {
    cardNumber: [CONSTANTS.SQUADHELP_BANK_NUMBER, cardNumber.replace(/ /g, '')],
  }, transaction);
};
