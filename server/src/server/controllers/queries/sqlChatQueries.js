const db = require('../../models');
const badRequestError = require('../../errors/BadRequestError');

module.exports.getUserConversation = async (userPredicate) => {
  return await db.Conversations.findOne({
    where: userPredicate,
    raw: true,
    nest: true,
  });
};

module.exports.getCatalogById = async (id) => {
  return await db.Catalogs.findOne({
    where: {
      id,
    },
    include: [{
      model: db.Conversations,
      //required: true,
      attributes: ['id'],
    }],
  });
};
