const db = require('../../models');

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

module.exports.createConversation = async (userId, interlocutorId) => {
  const conversation = await db.Conversations.create({
    interlocutorId,
    UserId: userId,
  });
  await db.UserToConversation.create({
    UserId: userId,
    ConversationId: conversation.id,
  });
  await db.UserToConversation.create({
    UserId: interlocutorId,
    ConversationId: conversation.id,
  });
  return conversation;
};
