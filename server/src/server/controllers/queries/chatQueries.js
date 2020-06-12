const Conversation = require('../../models/mongoModels/conversation');
const Message = require('../../models/mongoModels/Message');
const badRequestError = require('../../errors/BadRequestError');

module.exports.createConversation = async (conditions, update, options) => {
  const newConversation = await Conversation.findOneAndUpdate(conditions, update, options);
  if (!newConversation) {
    throw new badRequestError(new Error('Can not create conversation'));
  }
  return newConversation;
};

module.exports.getConversation = async (conditions, update, options) => {
  const chat = await Conversation.findOneAndUpdate(conditions, update, options);
  if (!chat) {
    throw new badRequestError(new Error('Can not пуе conversation'));
  }
  return chat;
};

module.exports.createMessage = async (message) => {
  const newMessage = new Message(message);
  if (!newMessage) {
    throw new badRequestError(new Error('Can not create message'));
  }
  await newMessage.save();
  return newMessage;
};
