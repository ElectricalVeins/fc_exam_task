const nodemailer = require('nodemailer');
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
    html: `<a href=${restoreLink}>RESTORE PASSWORD LINK</a>`, // html body
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
    from: '"SquadHelp" <SquadHelp@example.com>', // sender address
    to: receiver, // list of receivers
    subject: 'Offer Moderation', // Subject line
    text: `Your offer has been moderated! Contest ID: ${offer.contestId}, status: ${offer.status}`, // plain text body
    html: `<a href="${CONSTANTS.BASE_URL}contest/${offer.contestId}">Your offer has been moderated! Contest ID: ${offer.contestId}, status: ${offer.status}</a>`,
  });

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = { sendRestorePasswordEmail, sendOfferModerationEmail };
