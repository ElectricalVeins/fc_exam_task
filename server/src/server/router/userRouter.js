const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const tokenMiddlewares = require ('../middlewares/tokenMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const upload = require('../utils/fileUpload');

const userRouter = express.Router();

userRouter.post(
  '/changeMark',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

userRouter.post(
  '/updateUser',
  tokenMiddlewares.verifyToken,
  upload.uploadAvatar,
  userController.updateUser
);

userRouter.post(
  '/pay',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userMiddlewares.makePayment,
  userController.createContests
);

userRouter.post(
  '/cashout',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);

module.exports = userRouter;
