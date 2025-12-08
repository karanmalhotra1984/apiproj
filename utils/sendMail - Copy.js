const nodemailer = require("nodemailer");
const fs = require("fs");




const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,   // your email
        pass: process.env.MAIL_PASS    // app password (not gmail password)
      }
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html
    });

    console.log("Mail sent:", info.messageId);
    return true;

  } catch (error) {
    console.log("Mail error:", error);
    return false;
  }
};

module.exports = sendMail;
