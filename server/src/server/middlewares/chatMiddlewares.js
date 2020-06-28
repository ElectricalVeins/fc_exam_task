const _ = require('lodash');
const db = require('../models');

module.exports.getUserConversationIds = async (req, res, next) => {
  req.conversationList = [];
  try {
    const conversations = await db.UserToConversation.findAll({
      where: {
        UserId: req.tokenData.userId,
      },
    });
    conversations.forEach(conversation => {
      req.conversationList.push(conversation.ConversationId);
    });
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
