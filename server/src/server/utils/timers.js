const moment = require('moment');
const _ = require('lodash');
const timerQueries = require('../controllers/queries/timerQueries');
const controller = require('../../socketInit');

class TimerNotificator {
    constructor() {
        this._timers = new Map();
    }

    get timers() {
        return this._timers;
    }

    appendTimerToList(timer) {
        this.timers.set(this.formKey(timer.id, timer.warnDate), timer);   // может ставить флаги warned & final ?
        this.timers.set(this.formKey(timer.id, timer.finalDate), timer);
    }

    removeTimerFromList(timer, date) {
        this.timers.delete(this.formKey(timer.id, date));
    }

    sendNotification(userId, timer) {
        controller.getNotificationController().emitTimerWarning(userId, timer);
    }

    formKey(id, date) {
        return `${id}_${date}`;
    }

    async checkDate(timer) {
        console.log('start check');

        if (moment(timer.warnDate).isBefore(moment(new Date))) {
            console.log('====================sending_warn===========================')
            this.sendNotification(timer.userId, timer);
            this.removeTimerFromList(timer, timer.warnDate);
        }

        if (moment(timer.finalDate).isBefore(moment(new Date))) {
            console.log('====================sending_final===========================')
            this.sendNotification(timer.userId, timer);
            this.removeTimerFromList(timer, timer.finalDate);
        }

    }

    async initializeExistingTimers() {
        try {
            const timers = await timerQueries.getAllTimers();
            if (timers.length > 0) {
                for (const timer of timers) {
                    this.appendTimerToList(timer);
                }
            }
            this.startInterval();
            console.log('initial List===>', this.timers);
        } catch (err) {
            console.log(err);
        }
    }

    startInterval() {

        setInterval(() => {
            this.timers.forEach(async (timer) => {
                await this.checkDate(timer);
            });

            console.log('List===>', this.timers)

        }, 30000)

    }

    initializeNewTimer(timer) {
        try {
            this.appendTimerToList(timer);
            console.log('List===>', this.timers);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = {
    timerNotificator: new TimerNotificator()
}
