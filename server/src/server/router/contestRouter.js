const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const tokenMiddlewares = require('../middlewares/tokenMiddlewares');
const contestController = require('../controllers/contestController');
const upload = require('../utils/fileUpload');

const contestRouter = express.Router();

contestRouter.post(
  '/dataForContest',
  tokenMiddlewares.verifyToken,
  contestController.dataForContest
);

contestRouter.post(
  '/getCustomersContests',
  tokenMiddlewares.verifyToken,
  contestController.getCustomersContests
);

contestRouter.get(
  '/getContestById',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

contestRouter.post(
  '/getAllContests',
  tokenMiddlewares.verifyToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);


contestRouter.post(
  '/updateContest',
  tokenMiddlewares.verifyToken,
  upload.updateContestFile,
  basicMiddlewares.prepareOfferObjectToUpdate,
  contestController.updateContest
);

contestRouter.get(
  '/downloadFile/:fileName',
  tokenMiddlewares.verifyToken,
  contestController.downloadFile
);

module.exports = contestRouter;
