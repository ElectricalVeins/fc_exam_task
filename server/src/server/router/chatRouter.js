const express = require('express');
const tokenMiddlewares = require('../middlewares/tokenMiddlewares');
const chatController = require('../controllers/chatController');
const chatMiddlewares = require('../middlewares/chatMiddlewares');

const chatRouter = express.Router();

chatRouter.post('/createChat',
  tokenMiddlewares.verifyToken,
  chatMiddlewares.checkChatCreation,
  chatController.createChat
);

chatRouter.post(
  '/newMessage',
  tokenMiddlewares.verifyToken,
  chatMiddlewares.checkSendMessagePermission,
  chatController.addMessage
);

chatRouter.get(
  '/getChat',
  tokenMiddlewares.verifyToken,
  chatController.getChat
);

chatRouter.get(
  '/getPreview',
  tokenMiddlewares.verifyToken,
  chatMiddlewares.getUserConversationIds,
  chatController.getPreview
);

chatRouter.post(
  '/blackList',
  tokenMiddlewares.verifyToken,
  chatController.blackList
);

chatRouter.post(
  '/favorite',
  tokenMiddlewares.verifyToken,
  chatController.favoriteList
);

chatRouter.post(
  '/createCatalog',
  tokenMiddlewares.verifyToken,
  chatController.createCatalog
);

chatRouter.post(
  '/updateNameCatalog',
  tokenMiddlewares.verifyToken,
  chatMiddlewares.checkEditCatalogPermission,
  chatController.updateNameCatalog
);

chatRouter.post(
  '/addNewChatToCatalog',
  tokenMiddlewares.verifyToken,
  chatController.addNewChatToCatalog
);

chatRouter.delete(
  '/removeChatFromCatalog',
  tokenMiddlewares.verifyToken,
  chatController.removeChatFromCatalog
);

chatRouter.delete(
  '/deleteCatalog',
  tokenMiddlewares.verifyToken,
  chatController.deleteCatalog
);

chatRouter.get(
  '/getCatalogs',
  tokenMiddlewares.verifyToken,
  chatController.getCatalogs
);

module.exports = chatRouter;
