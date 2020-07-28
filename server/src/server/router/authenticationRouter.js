const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require('../middlewares/tokenMiddlewares');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');

const authRouter = express.Router();

authRouter.post(
  '/registration',
  validators.validateRegistrationData,
  userMiddlewares.hashPass,
  userMiddlewares.createUser,
  tokenMiddlewares.createAccessToken,
  userController.saveUserToken
);

authRouter.post(
  '/login',
  validators.validateLogin,
  userMiddlewares.findUserByEmail,
  userMiddlewares.passwordCompare,
  tokenMiddlewares.createAccessToken,
  userController.saveUserToken
);

authRouter.post(
  '/restorePassword',
  validators.validatePasswordRestore,
  basicMiddlewares.checkUser,  // CHeck logic. unnec email
  userMiddlewares.hashPass,
  tokenMiddlewares.createRestorePassToken,
  userController.sendRestoreEmail
);

authRouter.post(
  '/updateLostPassword',
  tokenMiddlewares.verifyRestorePasswordToken,
  userController.updateLostPassword
);

authRouter.get(
  '/getUser',
  tokenMiddlewares.verifyToken,
  userMiddlewares.findUserByEmail,
  userController.sendUser
);

module.exports = authRouter;
