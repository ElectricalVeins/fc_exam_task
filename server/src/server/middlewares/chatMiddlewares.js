const _ = require('lodash');
const db = require('../models');
const RightsError = require('../errors/RightsError');

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

module.exports.checkPermissionToEditCatalog = async (req, res, next) => {
  try {
    const { tokenData: { userId }, body: { catalogId } } = req;
    const catalogs = db.Catalogs.findAll({
      where: {
        userId,
        id: catalogId,
      },
    });
    console.log(catalogs);
    if (catalogs && catalogs.length !== 1) {
      next();
    }
    next(new RightsError('You dont have rights to edit this catalog'));
  } catch (err) {
    console.log(err);
    next(err);
  }
};
