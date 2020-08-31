const moment = require('moment');
const _ = require('lodash');
const timerQueries = require('../controllers/queries/timerQueries');
const controller = require('../../socketInit');
const { nodeMailer } = require('./sendEmail');
const { logToFile } = require('./logger/index');

class TimerNotificator {
  constructor() {
    this._timers = new Map();
  }

  get timers() {
    return this._timers;
  }

  set timers({ timer, id, dateDiffMs }) {
    this.timers.set(id, setTimeout(() => {
      this.sendNotification(timer.userId, timer);
      nodeMailer.sendTimerEmail(timer);
      this.timers.delete(id);
    }, dateDiffMs));
  }

  //class internal methods
  formKey(timer) {
    return `${timer.id}_${moment(timer.createdAt).format('x')}`;
  }

  sendNotification(userId, timer) {
    controller.getNotificationController().emitTimerWarning(userId, timer);
  }

  appendTimerToMap(timer, date) {
    const dateDiffMs = moment(date).diff(moment(new Date()));
    const id = this.formKey(timer);
    this.timers = { timer, id, dateDiffMs };
  }

  removeTimerFromMap(timer) {
    const timerToDelete = this.timers.get(this.formKey(timer));
    clearTimeout(timerToDelete);
    this.timers.delete(this.formKey(timer)); 
  }

  updateTimerInMap(timer, date) {
    this.removeTimerFromMap(timer);
    this.appendTimerToMap(timer, date);
  }

  async initializeExistingTimers() {
    try {
      const timers = await timerQueries.getWorkingTimers();
      if (timers.length > 0) {
        timers.forEach(timer => {
          this.appendTimerToMap(timer, timer.finalDate);
        });
      }
    } catch (err) {
      logToFile(err);
    }
  }

  //public interfaces situated below
  updateTimer(timer) {
    try {
      this.updateTimerInMap(timer, timer.finalDate);
    } catch (err) {
      logToFile(err);
    }
  }

  initializeNewTimer(timer) {
    try {
      this.appendTimerToMap(timer, timer.finalDate);
    } catch (err) {
      logToFile(err);
    }
  }

  deleteTimer(timer) {
    try {
      this.removeTimerFromMap(timer);
    } catch (err) {
      logToFile(err);
    }
  }
}

module.exports = {
  timerNotificator: new TimerNotificator(),
};
