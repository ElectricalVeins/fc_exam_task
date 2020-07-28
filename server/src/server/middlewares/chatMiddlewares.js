const db = require('../models');
const RightsError = require('../errors/RightsError');
const NotFound = require('../errors/UserNotFoundError');

module.exports.checkSendMessagePermission = async (req, res, next) => {
  try {
    const { body: { interlocutor }, tokenData: { userId } } = req;
    const list = await db.BlackList.findAll({ //массив пользователей, которые забанили user'a
      where: {
        blockedId: userId,
      },
    });
    list.forEach(item => {
      if(item.UserId === interlocutor.id){
        return next(new RightsError('You was banned by this user'));
      }
    });
    next();
  }catch (err) {
    next(err);
  }
};

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
    next(err);
  }
};

module.exports.checkEditCatalogPermission = async (req, res, next) => {
  try {
    const { tokenData: { userId }, body: { catalogId } } = req;
    const catalog = await db.Catalogs.findOne({
      where: {
        userId,
        id: catalogId,
      },
    });
    if (!catalog) {
      return next(new NotFound('Catalog not found'));
    }
    if (catalog && catalog.userId === userId) {
      return next();
    }
    next(new RightsError('You dont have permissions to edit this catalog'));
  } catch (err) {
    next(err);
  }
};

module.exports.checkChatCreation = async (req, res, next) => {
  try {
    const { body: { interlocutor }, tokenData: { userId } } = req;
    const conversation = await db.Conversations.findOne({
      where: {
        [db.Sequelize.Op.or]: [{
          UserId: interlocutor.id,
          interlocutorId: userId,
        }, {
          UserId: userId,
          interlocutorId: interlocutor.id,
        }],
      },
    });
    if (!conversation) {
      return next();
    }
    next(new RightsError('This chat has been already created'));
  } catch (err) {
    next(err);
  }
};
