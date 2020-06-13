const express = require('express');
const authRouter = require('./authenticationRouter');
const contestRouter = require('./contestRouter');
const chatRouter = require('./chatRouter');
const moderatorRouter = require('./moderatorRouter');
const userRouter = require('./userRouter')

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(contestRouter);
router.use(chatRouter);
router.use(moderatorRouter);

module.exports = router;
