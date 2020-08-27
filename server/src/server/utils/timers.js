const moment = require('moment');
const _ = require('lodash');
const timerQueries = require('../controllers/queries/timerQueries');
const controller = require('../../socketInit');
const { sendTimerEmail } = require('./sendEmail');

class TimerNotificator {
  constructor() {
    this._timers = new Map();
  }

  get timers() {
    return this._timers;
  }

  set timers({timer, identifier, dateDiffMs}) {
    this.timers.set(identifier, setTimeout(() => {
      this.sendNotification(timer.userId, timer);
      sendTimerEmail(timer);
      this.timers.delete(identifier);
    }, dateDiffMs));
  }

  //class internal functions
  formKey(timer) {
    return `${timer.id}_${moment(timer.createdAt).format('x')}`;
  }

  sendNotification(userId, timer) {
    controller.getNotificationController().emitTimerWarning(userId, timer);
  }

  appendTimerToList(timer, date) {
    const dateDiffMs = moment(date).diff(moment(new Date()));
    const identifier = this.formKey(timer);
    this.timers = {timer, identifier, dateDiffMs};
  }

  removeTimerFromList(timer) {
    const timerToDelete = this.timers.get(this.formKey(timer));
    clearTimeout(timerToDelete);
    this.timers.delete(this.formKey(timer)); //perform with get-set?
  }

  updateTimerToList(timer, date) {
    this.removeTimerFromList(timer);
    this.appendTimerToList(timer, date);
  }

  async initializeExistingTimers() {
    try {
      const timers = await timerQueries.getWorkingTimers();
      if (timers.length > 0) {
        for (const timer of timers) {
          this.appendTimerToList(timer, timer.finalDate);
        }
      }      
    } catch (err) {
      console.error(err);
    }
  }

  //public interfaces situated below
  updateTimer(timer) {
    try {
      this.updateTimerToList(timer, timer.finalDate);
    } catch (err) {
      console.error(err);
    }
  }

  initializeNewTimer(timer) {
    try {
      this.appendTimerToList(timer, timer.finalDate);
    } catch (err) {
      console.error(err);
    }
  }

  deleteTimer(timer) {
    try {
      this.removeTimerFromList(timer);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = {
  timerNotificator: new TimerNotificator(),
};
