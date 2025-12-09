const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function sendMail({ to, subject, htmlFile, data }) {

  // Read HTML template
  let html = fs.readFileSync(path.join(__dirname, htmlFile), 'utf8'); 

html =  html.replaceAll('{fname}', data.fname);

html =  html.replaceAll('{msg}', data.msg);

html =  html.replaceAll('{email}', data.email);
html =  html.replaceAll('{dt}', data.dt);

html = html.replaceAll('{company}',data.company);


  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
	port: process.env.MAIL_SMTP_PORT,
	host:process.env.MAIL_SMTP_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html
  });
}

module.exports = sendMail;
