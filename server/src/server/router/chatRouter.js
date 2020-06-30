const express = require('express');
//const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require('../middlewares/tokenMiddlewares');
const chatController = require('../controllers/chatController');
const sqlChatController = require('../controllers/sqlChatController');
const chatMiddlewares = require('../middlewares/chatMiddlewares');

const chatRouter = express.Router();

chatRouter.post(
  '/newMessage',
  tokenMiddlewares.verifyToken,
  sqlChatController.addSqlMessage
  /*tokenMiddlewares.verifyToken,
  chatController.addMessage*/
);

chatRouter.get(
  '/getChat',
  tokenMiddlewares.verifyToken,
  sqlChatController.getSqlChat
/*  tokenMiddlewares.verifyToken,
  userMiddlewares.findInterlocutorById,
  chatController.getChat*/
);

chatRouter.get(
  '/getPreview',
  tokenMiddlewares.verifyToken,
  chatMiddlewares.getUserConversationIds,
  sqlChatController.getSqlPreview
  /*tokenMiddlewares.verifyToken,
  chatController.getPreview*/
);

chatRouter.post(
  '/blackList',
  tokenMiddlewares.verifyToken,
  chatController.blackList
);

chatRouter.post(
  '/favorite',
  tokenMiddlewares.verifyToken,
  chatController.favoriteChat
);

chatRouter.post(
  '/createCatalog',
  tokenMiddlewares.verifyToken,
  sqlChatController.sqlCreateCatalog
  /*tokenMiddlewares.verifyToken,
  chatController.createCatalog*/
);

chatRouter.post(
  '/updateNameCatalog',
  tokenMiddlewares.verifyToken,
  sqlChatController.sqlUpdateNameCatalog
  //chatController.updateNameCatalog
);

chatRouter.post(
  '/addNewChatToCatalog',
  tokenMiddlewares.verifyToken,
  sqlChatController.sqlAddNewChatToCatalog
  //chatController.addNewChatToCatalog
);

chatRouter.delete(
  '/removeChatFromCatalog',
  tokenMiddlewares.verifyToken,
  sqlChatController.sqlRemoveChatFromCatalog
  //chatController.removeChatFromCatalog
);

chatRouter.delete(
  '/deleteCatalog',
  tokenMiddlewares.verifyToken,
  sqlChatController.sqlDeleteCatalog
  //chatController.deleteCatalog
);

chatRouter.get(
  '/getCatalogs',
  tokenMiddlewares.verifyToken,
  sqlChatController.sqlGetCatalogs,
/*chatController.getCatalogs*/
);

module.exports = chatRouter;
