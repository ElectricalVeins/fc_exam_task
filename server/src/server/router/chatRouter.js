const express = require('express');
const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require ('../middlewares/tokenMiddlewares');
const chatController = require('../controllers/chatController');

const chatRouter = express.Router();

chatRouter.post(
  '/newMessage',
  tokenMiddlewares.verifyToken,
  chatController.addMessage
);

chatRouter.get(
  '/getChat',
  tokenMiddlewares.verifyToken,
  userMiddlewares.findInterlocutorById,
  chatController.getChat
);

chatRouter.get(
  '/getPreview',
  tokenMiddlewares.verifyToken,
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
  chatController.favoriteChat
);


chatRouter.post(
  '/createCatalog',
  tokenMiddlewares.verifyToken,
  chatController.createCatalog
);

chatRouter.post(
  '/updateNameCatalog',
  tokenMiddlewares.verifyToken,
  chatController.updateNameCatalog
);

chatRouter.post(
  '/addNewChatToCatalog',
  tokenMiddlewares.verifyToken,
  chatController.addNewChatToCatalog
);

chatRouter.post(
  '/removeChatFromCatalog',
  tokenMiddlewares.verifyToken,
  chatController.removeChatFromCatalog
);

chatRouter.post(
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
