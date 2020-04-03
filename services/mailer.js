"use strict";
const nodemailer = require("nodemailer");

// send mail with defined transport object

exports.send = (params, content, cb) => {
  if (!params.from || !params.to || !params.subject || !content) {
    return cb({ err: "Missing data." });
  }

  const mailOptions = {
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: content
  };

  // create reusable transporter object using the default SMTP transport

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD
    }
  });

  transporter.sendMail(mailOptions, (err, info, resp) => {
    return cb(err, info, resp);
  });
};
