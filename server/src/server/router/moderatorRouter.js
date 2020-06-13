const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const tokenMiddlewares = require('../middlewares/tokenMiddlewares');
const offerController = require('../controllers/offerController');

const moderatorRouter = express.Router();

moderatorRouter.all(
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canModerateOffers
);

moderatorRouter.get('/moderator/getOffers',
  offerController.getAllUnModeratedOffers
);

moderatorRouter.post('/moderator/setOffer',
  userMiddlewares.findUserIdByContestId,
  offerController.offerModeration
);

module.exports = moderatorRouter;
