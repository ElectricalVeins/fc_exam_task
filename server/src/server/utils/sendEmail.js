const nodemailer = require('nodemailer');

async function sendRestorePasswordEmail(restoreLink, receiver) {
  try {

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
  } catch (err) {
    throw err;
  }
}

module.exports = { sendRestorePasswordEmail };
