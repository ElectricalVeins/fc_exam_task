const ServerError = require('../errors/ServerError');
const timerQueries = require('./queries/timerQueries');
const CONSTANTS = require('../../constants');
const {timerNotificator} = require('../utils/timers');

module.exports.getUserTimers = async (req, res, next) => {
    try {
        const { tokenData: { userId } } = req;
        const timers = await timerQueries.findAllUserTimers(userId);
        res.send(timers);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports.createTimer = async (req, res, next) => {
    try {
        const { tokenData: { userId }, body: { name, finalDate, warnDate } } = req;
        const newTimer = {
            userId,
            name,
            finalDate,
            warnDate
        };
        const timer = await timerQueries.createTimer(newTimer);
        timerNotificator.initializeNewTimer(timer.dataValues);
        res.send(timer);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports.deleteTimer = async (req, res, next) => {
    try {
        const { tokenData: { userId }, query: { id } } = req;
        const result = await timerQueries.softDeleteTimer(id, userId);
        res.send({result});
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports.updateTimer = async () => {
    try {
        const { tokenData: { userId }, body: { id, name, warnDate, finalDate } } = req;
        const updatedTimer = await timerQueries.updateTimer({ id, name, warnDate, finalDate }, userId)
        res.send(updatedTimer);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
