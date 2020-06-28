const _ = require('lodash');
const db = require('../models');
const controller = require('../../socketInit');

module.exports.addSqlMessage = async (req, res, next) => {
  try {
    //TODO:MW проверяющий находится ли юзер в blackList при каждой отправке смс
    const { tokenData: { userId }, body: { messageBody, interlocutor, conversationId } } = req; //TODO: front-> add 'conversationId' in axios request
    const message = await db.Messages.create({ body: messageBody, UserId: userId, ConversationId: conversationId });
    const preview = {
      _id: message.ConversationId,
      sender: userId,
      text: messageBody,
      createAt: message.createdAt,
      interlocutor,
      //participants, // скорее всгео не надо, т.к. есть теперь conversationId
    };
    controller.getChatController().emitNewMessage(interlocutor.id, {
      message,
      preview,
    }); // TODO: check this websocket

    res.send({ message, preview });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getSqlChat = async (req, res, next) => {
  try {
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
    const interlocutor = await db.Users.findOne({
      where: {
        id: chat.interlocutorId,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    res.send({ interlocutor, messages: chat.Messages, conversationId: chat.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getSqlPreview = async (req, res, next) => {
  try {
    //TODO: MW проверяющий при getChat находится ли юзер в black list. //Если да - отправлять ошибку и отображать её как ошибку в чате.
    const { conversationList } = req;
    const conversations = await db.Conversations.findAll({
      where: {
        id: conversationList,
      },
      order: [
        ['createdAt', 'ASC'],
      ], include: [{
        model: db.Messages,
        required: true,
        order: [
          ['createdAt', 'ASC'],
        ],
        limit: 1,
      }, {
        model: db.Users,
        required: true,
        attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
      }],
    });
    res.send(conversations);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

