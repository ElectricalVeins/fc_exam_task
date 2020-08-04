const nodemailer = require('nodemailer');
const userQueries = require('../controllers/queries/userQueries');
const CONSTANTS = require('../../constants');

async function sendRestorePasswordEmail(restoreLink, receiver) {
  const { user, pass } = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user, // generated ethereal user
      pass, // generated ethereal password
    },
  });
  const info = await transporter.sendMail({
    from: '"SquadHelp" <SquadHelp@example.com>', // sender address
    to: receiver, // list of receivers
    subject: 'Password restore', // Subject line
    text: `To restore password -> ${restoreLink}`, // plain text body
    html: `<a href=${restoreLink} target="_blank">RESTORE PASSWORD LINK</a>`, // html body
  });
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

async function sendOfferModerationEmail(offer, receiver) {
  const { user, pass } = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user, // generated ethereal user
      pass, // generated ethereal password
    },
  });
  const info = await transporter.sendMail({
    from: '"SquadHelp" <SquadHelp@example.com>',
    to: receiver,
    subject: 'Offer Moderation',
    text: `Your offer has been moderated! Contest ID: ${offer.contestId}, status: ${offer.status}`,
    html: `<a href="${CONSTANTS.BASE_URL}contest/${offer.contestId}" target="_blank">Your offer has been moderated! Contest ID: ${offer.contestId}, status: ${offer.status}</a>`,
  });
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

async function sendTimerEmail(timer) {
  try {
    const { email } = await userQueries.findUser(timer.userId);
    const { user, pass } = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user, // generated ethereal user
        pass, // generated ethereal password
      },
    });
    const info = await transporter.sendMail({
      from: '"SquadHelp" <SquadHelp@example.com>',
      to: email,
      subject: 'Timer Warning',
      text: `Your timer ${timer.name}  went off!`,
      html: `<a href="${CONSTANTS.BASE_URL}" target="_blank" >Your timer ${timer.name}  went off!</a>`,
    });
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendRestorePasswordEmail, sendOfferModerationEmail, sendTimerEmail };
