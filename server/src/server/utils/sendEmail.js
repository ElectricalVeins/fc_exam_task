const nodemailer = require('nodemailer');
const userQueries = require('../controllers/queries/userQueries');
const CONSTANTS = require('../../constants');

class NodeMailer {
  constructor(transporter) {
    this._transporter = transporter;
  }

  set transporter(transporter) {
    //validation. instanceof ?
    this._transporter = transporter;
  }

  get transporter() {
    return this._transporter;
  }

  async checkTransporter() {
    if (!this.transporter) {
      const { user, pass } = await nodemailer.createTestAccount();
      this.transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user,
          pass,
        },
      });
    }
  }

  async sendRestorePasswordEmail(restoreLink, receiver) {
    await this.checkTransporter();
    const info = await this.transporter.sendMail({
      from: '"SquadHelp" <SquadHelp@example.com>', // sender address
      to: receiver, // list of receivers
      subject: 'Password restore', // Subject line
      text: `To restore password -> ${restoreLink}`, // plain text body
      html: `<a href=${restoreLink} target="_blank">RESTORE PASSWORD LINK</a>`, // html body
    });
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async sendTimerEmail(timer) {
    await this.checkTransporter();
    const { email } = await userQueries.findUser(timer.userId);
    const info = await this.transporter.sendMail({
      from: '"SquadHelp" <SquadHelp@example.com>',
      to: email,
      subject: 'Timer Warning',
      text: `Your timer ${timer.name}  went off!`,
      html: `<a href="${CONSTANTS.BASE_URL}" target="_blank" >Your timer ${timer.name}  went off!</a>`,
    });
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async sendOfferModerationEmail(offer, receiver) {
    await this.checkTransporter();
    const info = await this.transporter.sendMail({
      from: '"SquadHelp" <SquadHelp@example.com>',
      to: receiver,
      subject: 'Offer Moderation',
      text: `Your offer has been moderated! Contest ID: ${offer.contestId}, status: ${offer.status}`,
      html: `<a href="${CONSTANTS.BASE_URL}contest/${offer.contestId}" target="_blank">Your offer has been moderated! Contest ID: ${offer.contestId}, status: ${offer.status}</a>`,
    });
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

module.exports = { nodeMailer: new NodeMailer() };
