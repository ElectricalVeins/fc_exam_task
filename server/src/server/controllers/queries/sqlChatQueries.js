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

module.exports.getConversationsPreview = async (conversationIds, userPredicate) => {
  return db.Conversations.findAll({
    where: {
      id: conversationIds,
    },
    order: [
      ['createdAt', 'DESC'],
    ], include: [{
      model: db.Users,
      required: true,
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
      where: userPredicate,
    }, {
      model: db.Messages,
      //required: true,
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: 1,
    }],
  }).map(item => item.get({ plain: true }));
};
