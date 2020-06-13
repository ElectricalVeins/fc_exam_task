const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const tokenMiddlewares = require('../middlewares/tokenMiddlewares');
const offerController = require('../controllers/offerController');
const upload = require('../utils/fileUpload');

const offerRouter = express.Router();

offerRouter.post(
  '/setNewOffer',
  tokenMiddlewares.verifyToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  basicMiddlewares.offerObjectCreator,
  offerController.setNewOffer
);

offerRouter.post(
  '/setOfferStatus',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  offerController.setOfferStatus
);

module.exports = offerRouter;
