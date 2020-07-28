const db = require('../models');
const _ = require('lodash');
const controller = require('../../socketInit');
const chatQueries = require('./queries/chatQueries');
const userQueries = require('./queries/userQueries');
const NotFoundError = require('../errors/UserNotFoundError');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { tokenData: { userId }, body: { messageBody, interlocutor, conversationId } } = req;
    const message = await chatQueries.createMessage(messageBody, userId, conversationId);
    const preview = {
      id: message.id,
      conversationId: message.ConversationId,
      UserId: userId,
      body: messageBody,
      createdAt: message.createdAt,
      interlocutor,
    };
    controller.getChatController().emitNewMessage(interlocutor.id, {
      message,
      preview,
    });

    res.send({ message, preview });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  try {
    const { query: { id } } = req; //conversationId
    const chat = await chatQueries.findChat(id);
    if (!chat) {
      return next(new NotFoundError('Chat not found'));
    }
    let interlocutorId;
    [chat.interlocutorId, chat.UserId].forEach((userId) => {
      if (userId !== req.tokenData.userId) {
        interlocutorId = userId;
      }
    });
    if (!interlocutorId) {
      return next(new NotFoundError('Interlocutor not found'));
    }
    const interlocutorRecord = await userQueries.findUser({
      id: interlocutorId,
    },
    );
    const interlocutor = _.pick(interlocutorRecord, ['id', 'firstName', 'lastName', 'displayName', 'avatar']);

    res.send({ interlocutor, messages: chat.Messages, conversationId: chat.id });
  } catch (err) {
    next(err);
  }
};

module.exports.createChat = async (req, res, next) => {
  try {
    const { body: { interlocutor }, tokenData: { userId } } = req;
    const conversation = await chatQueries.createConversation(userId, interlocutor.id);
    const result = conversation.dataValues;
    result.blackList = false;
    result.favoriteList = false;

    const preview = {
      ...result,
      Users: [{ ...interlocutor }],
      Messages: [],
    };

    res.send({ result, preview, interlocutor });
  } catch (err) {
    next(err);
  }
};


module.exports.getPreview = async (req, res, next) => {
  const blockedUsersArray = [];
  const favoriteUsersArray = [];
  try {
    const { conversationList, tokenData: { userId } } = req;

    const blockedUsers = await chatQueries.findAllById(db.BlackList, userId)
    blockedUsers.forEach(user => blockedUsersArray.push(user.blockedId));

    const favoriteUsers = await chatQueries.findAllById(db.FavoriteList, userId)
    favoriteUsers.forEach(user => favoriteUsersArray.push(user.favoriteId));

    const conversations = await chatQueries.getConversationsPreview(conversationList, userId);
    const result = conversations.map(conversation => {
      return {
        ...conversation,
        blackList: blockedUsersArray.includes(conversation.interlocutorId) || blockedUsersArray.includes(conversation.UserId),
        favoriteList: favoriteUsersArray.includes(conversation.interlocutorId) || favoriteUsersArray.includes(conversation.UserId),
      };
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  let result;
  try {
    const { body: { interlocutorId, isCreate }, tokenData: { userId } } = req;
    const info = { //naming
      UserId: userId,
      blockedId: interlocutorId,
    };
    const blackListRecord = await chatQueries.toggleListRecord(isCreate, db.BlackList, info)

    result = await chatQueries.getUserConversation(blackListRecord.blockedId, userId);
    controller.getChatController().emitChangeBlockStatus(interlocutorId, /*chat*/ result);
    res.status(200).send({ ...result, isCreate });
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteList = async (req, res, next) => {
  let result;
  try {
    const { body: { interlocutorId, isCreate }, tokenData: { userId } } = req;
    const info = {
      UserId: userId,
      favoriteId: interlocutorId,
    };
    const favoriteListRecord = await chatQueries.toggleListRecord(isCreate, db.FavoriteList, info)

    result = await chatQueries.getUserConversation(favoriteListRecord.favoriteId, userId);
    res.status(200).send({ ...result, isCreate });
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const { tokenData: { userId } } = req;
    const catalogs = await chatQueries.getCatalogsForUser(userId);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};  

module.exports.createCatalog = async (req, res, next) => {
  try {
    const { tokenData: { userId }, body: { catalogName, chatId } } = req;
    const catalog = await chatQueries.createCatalog(catalogName, userId, chatId);
    const result = await chatQueries.getCatalogById(catalog.id);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const { body: { catalogName, catalogId } } = req;
    await chatQueries.updateCatalogName(catalogName, catalogId);
    const catalog = await chatQueries.getCatalogById(catalogId);
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const { tokenData: { userId }, query: { id } } = req; // id->catalogId
    await chatQueries.deleteCatalog(id, userId);
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const { body: { catalogId, chatId } } = req;
    await chatQueries.addChatToCatalog(catalogId, chatId);
    const catalog = await chatQueries.getCatalogById(catalogId);
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const { query: { id, catalogId } } = req; //id => conversationId
    await chatQueries.deleteChatFromCatalog(id, catalogId)
    const catalog = await chatQueries.getCatalogById(catalogId);
    res.send(catalog).status(200);
  } catch (err) {
    next(err);
  }
};
