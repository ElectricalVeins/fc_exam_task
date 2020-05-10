const nodemailer = require("nodemailer");

async function sendRestorePasswordEmail(restoreLink) {
    try {

        const {user,pass} = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user, // generated ethereal user
                pass // generated ethereal password
            }
        });

        const info = await transporter.sendMail({
            from: '"SquadHelp" <foobar@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Password restore", // Subject line
            text: "To restore password - click the link", // plain text body
            html: `<a>${restoreLink}</a>` // html body
        });

        console.log("Message sent: ", info);

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL:
    } catch (err) {
        throw err
    }
}

module.exports = {sendRestorePasswordEmail}