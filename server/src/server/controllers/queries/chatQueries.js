const db = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.getUserConversation = async (id, userId) => {
  return await db.Conversations.findOne({
    where: {
      [db.Sequelize.Op.or]: [{
        UserId: id,
        interlocutorId: userId,
      }, {
        interlocutorId: id,
        UserId: userId,
      }],
    },
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
      attributes: ['id'],
    }],
  });
};

module.exports.getConversationsPreview = async (conversationIds, id) => {
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
      where: {
        [db.Sequelize.Op.not]: [{ id }],
      },
    }, {
      model: db.Messages,
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
  await db.UserToConversation.create({ //bulkCreate ?
    UserId: userId,
    ConversationId: conversation.id,
  });
  await db.UserToConversation.create({
    UserId: interlocutorId,
    ConversationId: conversation.id,
  });
  return conversation;
};

module.exports.toggleListRecord = async (isCreate, collection, data) => {
  let record;
  if (isCreate) {
    record = await collection.create(data);
  } else {
    record = await collection.findOne({ where: data });
    await collection.destroy({ where: data });
  }
  return record;
};

module.exports.createMessage = async (body, userId, conversationId) => {
  return await db.Messages.create({
    body,
    UserId: userId,
    ConversationId: conversationId,
  });
};

module.exports.findChat = async (id) => {
  return await db.Conversations.findOne({
    where: {
      id,
    },
    include: [{
      model: db.Messages,
      order: [
        ['createdAt', 'ASC'],
      ],
    }],
  });
};

module.exports.findAllById = async (collection, id) => {
  return await collection.findAll({
    where: {
      UserId: id,
    },
  });
};

module.exports.getCatalogsForUser = async (userId) => {
  return await db.Catalogs.findAll({
    where: {
      userId,
    },
    include: [{
      model: db.Conversations,
    }],
  });
};

module.exports.createCatalog = async (name, userId, chatId) => {
  const catalog = await db.Catalogs.create({
    name,
    userId,
  });
  await db.CatalogToConversation.create({
    CatalogId: catalog.id,
    ConversationId: chatId,
  });
  return catalog;
};

module.exports.updateCatalogName = async (name, id, transaction) => {
  const [count, records] = await db.Catalogs.update({ name }, { where: { id }, transaction });
  if (count !== 1) {
    throw new ServerError('can not update catalog name!');
  }
};

module.exports.deleteCatalog = async (id, userId) => {
  await db.Catalogs.destroy({ where: { id, userId } });
};

module.exports.addChatToCatalog = async (catalogId, chatId) => {
  await db.CatalogToConversation.create({
    CatalogId: catalogId,
    ConversationId: chatId,
  });
};

module.exports.deleteChatFromCatalog = async (conversationId, catalogId) => {
  await db.CatalogToConversation.destroy({
    where: {
      ConversationId: conversationId,
      CatalogId: catalogId,
    },
  });
};
