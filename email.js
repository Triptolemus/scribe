const nodemailer = require('nodemailer');
const config = require('./local/local.js');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    auth: {
        user: config.email, // generated ethereal user
        pass: config.pw // generated ethereal password
    }
});

// setup email data with unicode symbols

module.exports = {
  send_email: function (to_address, subject, body) {
    let mailOptions = {
      from: config.email, // sender address
      to: to_address, // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
    };

    // send mail with defined transport object
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }
};
