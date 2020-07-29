const moment = require('moment');
const timerQueries = require('../controllers/queries/timerQueries');
const controller = require('../../socketInit');

module.exports.startTimers = () => {
    try {
        const timers = timerQueries.getAllTimers();
        console.log(timers);
        for (const timer of timers) {
            const currentTime = moment(new Date());
            const warn = moment(timer.warnDate);
            const dateDiffMs = currentTime.diff(warn);
            console.log(dateDiffMs);
            setTimeout(() => {
                controller.getNotificationController().emitTimerWarning(timer.userId, timer);
            }, dateDiffMs)
        }
    } catch (err) {
        console.log(err);
    }
};
