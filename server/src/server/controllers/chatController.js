const _ = require('lodash');
const Message = require('../models/mongoModels/Message');
const Catalog = require('../models/mongoModels/Catalog');
const chatQueries = require('./queries/chatQueries')
const db = require('../models/index');
const controller = require('../../socketInit');
const BadRequestError = require('../errors/BadRequestError');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort((participant1, participant2) => participant1 - participant2);
  try {
    const {tokenData:{userId,},body:{messageBody,firstName,lastName,displayName,avatar,email},interlocutor}=req;
    const newConversation = await chatQueries.createConversation({participants}, {
      participants,
      blackList: [false, false],
      favoriteList: [false, false]
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false,
    })
    const message = chatQueries.createMessage({
      sender: userId,
      body: messageBody,
      conversation: newConversation._id,
    })
    message._doc.participants = participants;
    const interlocutorId = participants.filter((participant) => participant !== req.tokenData.userId)[0];
    const preview = {
      _id: newConversation._id,
      sender: userId,
      text: messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        _id: newConversation._id,
        sender: userId,
        text: messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {id: userId, firstName, lastName, displayName, avatar, email},
      },
    });
    // { message, preview: Object.assign(preview, { interlocutor }) }
    res.send({message, preview: {...preview, interlocutor}});
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.getChat = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort((participant1, participant2) => participant1 - participant2);
  try {
    const {interlocutor} = req;
    const messages = await Message.aggregate([{
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      }, {
      $match: { 'conversationData.participants': participants }
      }, {
      $sort: { createdAt: 1 }
      }, {
        $project: {
          '_id': 1,
          'sender': 1,
          'body': 1,
          'conversation': 1,
          'createdAt': 1,
          'updatedAt': 1,
        },
      }]);
    const { firstName, lastName, displayName, id, avatar } = interlocutor;
    res.send({messages, interlocutor: {firstName,lastName, displayName, id, avatar,}});
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([{
      $lookup: {
        from: 'conversations',
        localField: 'conversation',
        foreignField: '_id',
        as: 'conversationData',
      },
    }, {
      $unwind: '$conversationData',
    }, {
      $match: {
          'conversationData.participants': req.tokenData.userId,
      },
    }, {
      $sort: {
        createdAt: -1,
      },
    }, {
      $group: {
        _id: '$conversationData._id',
        sender: { $first: '$sender' },
        text: { $first: '$body' },
        createAt: { $first: '$createdAt' },
        participants: { $first: '$conversationData.participants' },
        blackList: { $first: '$conversationData.blackList' },
        favoriteList: { $first: '$conversationData.favoriteList' },
      },
    }]);
    const interlocutors = [];
    conversations.forEach(conversation => {
      interlocutors.push(conversation.participants.find((participant) => participant !== req.tokenData.userId));
    });
    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach((conversation) => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(conversations);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.blackList = async (req, res, next) => {
  try {
    const {body:{participants,blackListFlag},tokenData:{userId}}=req;
    const predicate = 'blackList.' + participants.indexOf(userId);
    const chat = await chatQueries.getConversation({participants}, {$set: {[predicate]: blackListFlag}}, {new: true});
    res.send(chat);
    const interlocutorId = participants.filter((participant) => participant !== userId)[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  try {
    const {body: {participants, favoriteFlag}, tokenData: {userId}} = req;
    const predicate = 'favoriteList.' + participants.indexOf(userId);
    const chat = await chatQueries.getConversation({participants}, {$set: {[predicate]: favoriteFlag}}, {new: true});
    res.send(chat);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const {body: {chatId, catalogName}, tokenData: {userId}} = req;
    const catalog = new Catalog({userId, catalogName, chats: [chatId]});
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const {body: {catalogId, catalogName}, tokenData: {userId}} = req;
    const catalog = await Catalog.findOneAndUpdate({_id: catalogId, userId}, {catalogName}, {new: true});
    res.send(catalog);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const {body: {catalogId, chatId}, tokenData: {userId}} = req;
    const catalog = await Catalog.findOneAndUpdate({_id: catalogId, userId}, {$addToSet: {chats: chatId}}, {new: true});
    res.send(catalog);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const {body: {catalogId, chatId}, tokenData: {userId}} = req;
    const catalog = await Catalog.findOneAndUpdate({_id: catalogId, userId,}, {$pull: {chats: chatId}}, {new: true});
    res.send(catalog);
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const {body: {catalogId}, tokenData: {userId}} = req;
    await Catalog.remove({_id: catalogId, userId});
    res.end();
  } catch (err) {
    next(new BadRequestError(err));
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const {tokenData: {userId}} = req;
    const catalogs = await Catalog.aggregate([{$match: {userId}}, {$project: {_id: 1, catalogName: 1, chats: 1}}]);
    res.send(catalogs);
  } catch (err) {
    next(new BadRequestError(err));
  }
};
