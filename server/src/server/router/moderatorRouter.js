const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require ('../middlewares/tokenMiddlewares');
const offerController = require('../controllers/offerController');

const moderatorRouter = express.Router();

moderatorRouter.get('/moderator/getOffers',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canModerateOffers,
  offerController.getAllUnModeratedOffers
);

moderatorRouter.post('/moderator/setOffer',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canModerateOffers,
  userMiddlewares.findUserIdByContestId,
  offerController.offerModeration
);

module.exports = moderatorRouter;