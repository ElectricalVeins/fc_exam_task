const _ = require('lodash');
const db = require('../models');
const controller = require('../../socketInit');
const sqlChatQueries = require('./queries/sqlChatQueries');
const NotFoundError = require('../errors/UserNotFoundError');

module.exports.addSqlMessage = async (req, res, next) => {
  try {
    //TODO:MW проверяющий находится ли юзер в blackList при каждой отправке смс
    const { tokenData: { userId }, body: { messageBody, interlocutor, conversationId } } = req; //TODO: front-> add 'conversationId' in axios request
    const message = await db.Messages.create({ body: messageBody, UserId: userId, ConversationId: conversationId });
    const preview = {
      id: message.id,
      conversationId: message.ConversationId,
      UserId: userId,
      body: messageBody,
      createdAt: message.createdAt,
      interlocutor,
      //participants, // скорее всгео не надо, т.к. есть теперь conversationId
    };
    console.log(interlocutor)
    controller.getChatController().emitNewMessage(interlocutor.id, {
      message,
      preview,
    }); // TODO: check this websocket

    res.send({ message, preview });
  } catch (err) {
    console.log(err);
    next(err);
  }
}; // ok

module.exports.getSqlChat = async (req, res, next) => {
  try {
    //TODO: MW проверяющий при getChat находится ли юзер в black list. //Если да - отправлять ошибку и отображать её как ошибку в чате
    const { query: { id } } = req; //conversationId
    const chat = await db.Conversations.findOne({
      where: {
        id,
      },
      include: [{
        model: db.Messages,
        required: true,
        order: [
          ['createdAt', 'ASC'],
        ],
      }],
    });
    if (!chat) {
      next(new NotFoundError('Chat not found'));
    }
    let interlocutorId;
    [chat.interlocutorId, chat.UserId].forEach((userId) => {
      if (userId !== req.tokenData.userId) {
        interlocutorId = userId;
      }
    });
    if (!interlocutorId) {
      next(new NotFoundError('Interlocutor not found'));
    }
    const interlocutor = await db.Users.findOne({
      where: {
        id: interlocutorId,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    res.send({ interlocutor, messages: chat.Messages, conversationId: chat.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
}; // ok
                                                                        // чтото с временем

module.exports.getSqlPreview = async (req, res, next) => {
  try {
    const { conversationList } = req;
    const conversations = await db.Conversations.findAll({
      where: {
        id: conversationList,
      },
      order: [
        ['createdAt', 'DESC'],
      ], include: [{
        model: db.Messages,
        required: true,
        order: [
          ['createdAt', 'DESC'],
        ],
        limit: 1,
      }, {
        model: db.Users,
        required: true,
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
        where:{
          [db.Sequelize.Op.not]: [{ id: req.tokenData.userId }],
        },
      }],
    });
    res.send(conversations);
  } catch (err) {
    console.log(err);
    next(err);
  }
}; // ok

module.exports.sqlBlackList = async (req, res, next) => {
  try {
    const { body: { interlocutorId }, tokenData: { userId } } = req;
    const blackList = await db.BlackList.create({ UserId: userId, blockedId: interlocutorId });
    controller.getChatController().emitChangeBlockStatus(interlocutorId, /*chat*/ blackList);
    res.send(blackList);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.sqlFavoriteList = async (req, res, next) => {
  try {
    const { body: { interlocutorId }, tokenData: { userId } } = req;
    const favoriteList = await db.FavoriteList.create({ UserId: userId, favoriteId: interlocutorId });
    res.send(favoriteList);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.sqlGetCatalogs = async (req, res, next) => {
  try {
    const { tokenData: { userId } } = req;
    const catalogs = await db.Catalogs.findAll({
      where: {
        userId,
      },
      include:[{
        model:db.Conversations,
        //required:true,
      }],
    });
    res.send(catalogs);
  } catch (err) {
    console.log(err);

    next(err);
  }
}; // ok

module.exports.sqlCreateCatalog = async (req, res, next) => {
  try {
    const { tokenData: { userId }, body: { catalogName, chatId } } = req;
    const catalog = await db.Catalogs.create({
      name: catalogName,
      userId,
    });
    await db.CatalogToConversation.create({
      CatalogId: catalog.id,
      ConversationId: chatId,
    });
    const result = await sqlChatQueries.getCatalogById(catalog.id);
    res.send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
}; // ok

module.exports.sqlUpdateNameCatalog = async (req, res, next) => {
  try {
    const { tokenData: { userId }, body: { catalogName, catalogId } } = req;

    await db.Catalogs.update({
      name: catalogName,
    }, {
      where: {
        id: catalogId,
      },
    });
    const catalog = await sqlChatQueries.getCatalogById(catalogId);
    res.send(catalog);
  } catch (err) {
    console.log(err);
    next(err);
  }
}; // ok

module.exports.sqlDeleteCatalog = async (req, res, next) => {
  try {
    const { tokenData: { userId }, query: { id } } = req; // catalogId
    await db.Catalogs.destroy({ where: { id, userId } });
    res.end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.sqlAddNewChatToCatalog = async (req, res, next) => {
  try {
    //TODO:permissionCheck MW!
    const { tokenData: { userId }, body: { catalogId, chatId } } = req;
    await db.CatalogToConversation.create({
      CatalogId: catalogId,
      ConversationId: chatId,
    });
    const catalog = await sqlChatQueries.getCatalogById(catalogId);
    res.send(catalog);
  }catch (err) {
    console.log(err);
    next(err);
  }
}; // ok

module.exports.sqlRemoveChatFromCatalog = async (req, res, next) => {
  try {
    //TODO:permissionCheck MW!
    const { query: { id, catalogId } } = req; //chatId
    await db.CatalogToConversation.destroy({
      where: {
        ConversationId: id,
        CatalogId: catalogId,
      },
    });
    const catalog = await sqlChatQueries.getCatalogById(catalogId);
    res.send(catalog).status(200);
  }catch (err) {
    console.log(err);
    next(err);
  }
}; // ok

// TODO: создание чатов, blackList, favoriteList,
