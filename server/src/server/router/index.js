const express = require('express');
const { logToFile } = require('../utils/logger');
const authRouter = require('./authenticationRouter');
const contestRouter = require('./contestRouter');
const chatRouter = require('./chatRouter');
const moderatorRouter = require('./moderatorRouter');
const userRouter = require('./userRouter');
const offerRouter = require('./offerRouter');
const timerRouter = require('./timerRouter');
const sequelizeErrorHandler = require('../middlewares/errorHandlers/sequelizeErrorHandler');
const applicationErrorHandler = require('../middlewares/errorHandlers/applicationErrorHandler');
const validationErrorHandler = require('../middlewares/errorHandlers/validationErrorHandler');
const serverErrorHandler = require('../middlewares/errorHandlers/index');

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(contestRouter);
router.use(offerRouter);
router.use(chatRouter);
router.use(timerRouter);
router.use(moderatorRouter);

//ERROR HANDLING
router.use((err, req, res, next) => {
  console.log('ERROR LOGGER=>', JSON.stringify(err, null, 4));
  logToFile(err);
  next(err);
});
router.use(validationErrorHandler);
router.use(sequelizeErrorHandler);
router.use(applicationErrorHandler);
router.use(serverErrorHandler);

module.exports = router;
