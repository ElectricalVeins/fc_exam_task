const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require ('../middlewares/tokenMiddlewares');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const offerController = require('../controllers/offerController');
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
  userMiddlewares.findUserByEmail,
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
  tokenMiddlewares.verifyRestorePasswordToken,
  userController.updateLostPassword
);

router.post(
  '/dataForContest',
  tokenMiddlewares.verifyToken,
  contestController.dataForContest
);

router.post(
  '/pay',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment
);

router.post(
  '/getCustomersContests',
  tokenMiddlewares.verifyToken,
  contestController.getCustomersContests
);

router.get(
  '/getContestById',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

router.post(
  '/getAllContests',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);

router.post(
  '/getUser',
  tokenMiddlewares.verifyToken,
  userMiddlewares.findUserByEmail,
  userController.sendUser
);

router.get(
  '/downloadFile/:fileName',
  tokenMiddlewares.verifyToken,
  contestController.downloadFile
);

router.post(
  '/updateContest',
  tokenMiddlewares.verifyToken,
  upload.updateContestFile,
  basicMiddlewares.prepareOfferObjectToUpdate,
  contestController.updateContest
);

router.post(
  '/setNewOffer',
  tokenMiddlewares.verifyToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  basicMiddlewares.offerObjectCreator,
  offerController.setNewOffer
);

router.post(
  '/setOfferStatus',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  offerController.setOfferStatus
);

router.post(
  '/changeMark',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

router.post(
  '/updateUser',
  tokenMiddlewares.verifyToken,
  upload.uploadAvatar,
  userController.updateUser
);

router.post(
  '/cashout',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);


router.post(
  '/newMessage',
  tokenMiddlewares.verifyToken,
  chatController.addMessage
);

router.post(
  '/getChat',
  tokenMiddlewares.verifyToken,
  chatController.getChat
);

router.post(
  '/getPreview',
  tokenMiddlewares.verifyToken,
  chatController.getPreview
);


router.post(
  '/blackList',
  tokenMiddlewares.verifyToken,
  chatController.blackList
);


router.post(
  '/favorite',
  tokenMiddlewares.verifyToken,
  chatController.favoriteChat
);


router.post(
  '/createCatalog',
  tokenMiddlewares.verifyToken,
  chatController.createCatalog
);

router.post(
  '/updateNameCatalog',
  tokenMiddlewares.verifyToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  tokenMiddlewares.verifyToken,
  chatController.addNewChatToCatalog
);

router.post(
  '/removeChatFromCatalog',
  tokenMiddlewares.verifyToken,
  chatController.removeChatFromCatalog
);

router.post(
  '/deleteCatalog',
  tokenMiddlewares.verifyToken,
  chatController.deleteCatalog
);

router.post(
  '/getCatalogs',
  tokenMiddlewares.verifyToken,
  chatController.getCatalogs
);

router.get('/moderator/getOffers',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canModerateOffers,
  offerController.getAllUnModeratedOffers
);

router.post('/moderator/setOffer',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canModerateOffers,
  userMiddlewares.findUserIdByContestId,
  offerController.offerModeration
);

module.exports = router;


