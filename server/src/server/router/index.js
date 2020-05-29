const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require ('../middlewares/tokenMiddlewares');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const chatController = require('../controllers/chatController');
const upload = require('../utils/fileUpload');


const router = express.Router();

router.post(
  '/registration',
  validators.validateRegistrationData,
  userMiddlewares.hashPass,
  userMiddlewares.createUser,
  tokenMiddlewares.createAccessToken,
  userController.saveUserToken
);

router.post(
  '/login',
  validators.validateLogin,
  userMiddlewares.findUser,
  userMiddlewares.passwordCompare,
  tokenMiddlewares.createAccessToken,
  userController.saveUserToken
);

router.post(
  '/restorePassword',
  validators.validatePasswordRestore,
  basicMiddlewares.checkUser,
  userMiddlewares.hashPass,
  tokenMiddlewares.createRestorePassToken,
  userController.sendRestoreEmail
);

router.post(
  '/updateLostPassword',
  checkToken.verifyRestorePasswordToken,
  userController.updateLostPassword
);

router.post(
  '/dataForContest',
  checkToken.checkToken,
  contestController.dataForContest
);

router.post(
  '/pay',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment
);

router.post(
  '/getCustomersContests',
  checkToken.checkToken,
  contestController.getCustomersContests
);

router.get(
  '/getContestById',
  checkToken.checkToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

router.post(
  '/getAllContests',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);

router.post(
  '/getUser',
  checkToken.checkAuth
);

router.get(
  '/downloadFile/:fileName',
  checkToken.checkToken,
  contestController.downloadFile
);

router.post(
  '/updateContest',
  checkToken.checkToken,
  upload.updateContestFile,
  contestController.updateContest
);

router.post(
  '/setNewOffer',
  checkToken.checkToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

router.post(
  '/setOfferStatus',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

router.post(
  '/changeMark',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

router.post(
  '/updateUser',
  checkToken.checkToken,
  upload.uploadAvatar,
  userController.updateUser
);

router.post(
  '/cashout',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);


router.post(
  '/newMessage',
  checkToken.checkToken,
  chatController.addMessage
);

router.post(
  '/getChat',
  checkToken.checkToken,
  chatController.getChat
);

router.post(
  '/getPreview',
  checkToken.checkToken,
  chatController.getPreview
);


router.post(
  '/blackList',
  checkToken.checkToken,
  chatController.blackList
);


router.post(
  '/favorite',
  checkToken.checkToken,
  chatController.favoriteChat
);


router.post(
  '/createCatalog',
  checkToken.checkToken,
  chatController.createCatalog
);

router.post(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatController.addNewChatToCatalog
);

router.post(
  '/removeChatFromCatalog',
  checkToken.checkToken,
  chatController.removeChatFromCatalog
);

router.post(
  '/deleteCatalog',
  checkToken.checkToken,
  chatController.deleteCatalog
);

router.post(
  '/getCatalogs',
  checkToken.checkToken,
  chatController.getCatalogs
);

module.exports = router;


