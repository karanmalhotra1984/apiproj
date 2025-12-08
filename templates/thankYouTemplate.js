function thankYouTemplate(fname, msg) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Thank You</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">

      <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
              <td align="center" style="padding:30px;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05);">
                      
                      <!-- HEADER -->
                      <tr>
                          <td style="background:#4CAF50;color:white;padding:20px;text-align:center;font-size:22px;font-weight:bold;">
                              Thank You for Contacting Us!
                          </td>
                      </tr>

                      <!-- BODY -->
                      <tr>
                          <td style="padding:25px;font-size:15px;color:#333;">
                              <p>Hello <strong>${fname}</strong>,</p>

                              <p>Thank you for reaching out to us. We’ve received your message and our team will get back to you as soon as possible.</p>

                              <p><strong>Your Message:</strong></p>
                              <div style="background:#f9f9f9;padding:12px;border-left:4px solid #4CAF50;">
                                  ${msg}
                              </div>

                              <p style="margin-top:15px;">
                                  If your query is urgent, feel free to reply directly to this email.
                              </p>

                              <p>Warm Regards,<br>
                              <strong>Your Company Team</strong></p>
                          </td>
                      </tr>

                      <!-- FOOTER -->
                      <tr>
                          <td style="background:#eee;padding:12px;text-align:center;font-size:12px;color:#777;">
                              © ${new Date().getFullYear()} Your Company Name | All rights reserved
                          </td>
                      </tr>

                  </table>
              </td>
          </tr>
      </table>

  </body>
  </html>
  `;
}

module.exports = thankYouTemplate;
