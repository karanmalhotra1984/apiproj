const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function sendMail({ to, subject, htmlFile, data }) {

if(htmlFile === null)
	return;

  const templatePath = path.join(__dirname,  htmlFile);


  let html = fs.readFileSync(templatePath, 'utf8');

  html = html.replaceAll('{fname}', data.fname || "");
  html = html.replaceAll('{msg}', data.msg || "");
  html = html.replaceAll('{email}', data.email || "");
  html = html.replaceAll('{dt}', data.dt || "");
  html = html.replaceAll('{company}', data.company || "");

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    port: data.user.port,
    host: data.user.host,
    auth: {
      user: data.user.user,
      pass: data.user.pass
    }
  });

  await transporter.sendMail({
    from: data.user.user,
    to,
    subject,
    html
  });
}

module.exports = sendMail;
