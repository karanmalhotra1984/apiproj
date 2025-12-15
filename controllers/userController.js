const User = require("../models/User");
const APIError = require("../models/APIError");
const DBEntry = require("../models/DBEntry");
const sendMail = require("../utils/sendMail");
const fs  = require("fs");
const path  = require("path");

// GET /api/users
exports.getUsers = (req, res) => {
  res.json(users);
};

function getPrefix(group) {
  const prefixMap = {
    credmanager: "credmanager",
    taxmanager: "taxmanager",
    riseit360: "riseit360",
    risingadvisory: "risingadvisory",
    localhost: "localhost" 
  };

  group = group.toLowerCase();

  if (!(group in prefixMap)) {
    throw new Error(`Unknown mail group: ${group}`);
  }

  return prefixMap[group]
    ? `${prefixMap[group]}`
    : "MAIL";
}

function getMailConfig(config, group) {
    
	//if (!config[group] || !config[group][0]) return null;

    //const data = config[group][0];
	
	const data = config[group][0];	
	
    //const prefix = group === getPrefix(group) ? "MAIL" : `MAIL`;


	const prefix = getPrefix(group);

    return {
        user: data[`${prefix}_USER`] || null,
        pass: data[`${prefix}_PASS`] || null,
        host: data[`${prefix}_SMTP_HOST`] || null,
        port: data[`${prefix}_SMTP_PORT`] || null,
        service: data[`${prefix}_SERVICE`] || null,
        self: data[`${prefix}_SELF`] || null,
		htmlfile: data[`${prefix}_FILE`] || null
    };
}
function getGroupFromUrl(url) {
  const host = new URL(url).hostname.toLowerCase();
  const parts = host.split(".");

  if (parts[0] === "www") {
    parts.shift();
  }

  return parts[0]; // taxmanager, risingadvisory
}

// POST /api/users/add
exports.addUser = async (req, res) => {
  try {
    /* ================= INPUT ================= */
    const { fname, email, mobile, msg } = req.body;

    if (!fname || !email || !mobile || !msg) {
      return res.status(400).json({ message: "All fields required!" });
    }

    /* ================= SAVE USER ================= */
    const savedUser = await new User({ fname, email, mobile, msg }).save();

    /* ================= LOG ENTRY ================= */
    await new DBEntry({
      userid: savedUser._id,
      origin: req.get("origin"),
      referer: req.get("referer"),
      originalUrl: req.originalUrl,
      method: req.method
    }).save();

    /* ================= LOAD CONFIG ================= */
    const configPath = path.join(__dirname, "../config/config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    /* ================= RESOLVE GROUP ================= */
    const origin = req.get("origin") || "http://localhost";
    let group = getGroupFromUrl(origin);

    if (!group) group = "localhost";
    group = group.toLowerCase();

    // fallback if group not present
    if (!config[group]) {
      group = "localhost";
    }

    if (!Array.isArray(config[group]) || !config[group][0]) {
      throw new Error(`Mail config missing or invalid for group: ${group}`);
    }

    const mailData = config[group][0];

    /* ================= PREFIX LOGIC ================= */
    const isLocal = group === "localhost";
    const prefix = isLocal ? "MAIL" : `MAIL_${group.toUpperCase()}`;

    const mailUser = {
      user: mailData[`${prefix}_USER`],
      pass: mailData[`${prefix}_PASS`],
      host: mailData[`${prefix}_SMTP_HOST`],
      port: mailData[`${prefix}_SMTP_PORT`],
      service: mailData[`${prefix}_SERVICE`],
      self: mailData[`${prefix}_SELF`],
      htmlfile: mailData[`${prefix}_FILE`]
    };

    if (!mailUser.user || !mailUser.pass) {
      throw new Error(`SMTP credentials missing for group: ${group}`);
    }

    /* ================= SEND MAIL TO USER ================= */
    await sendMail({
      to: email,
      subject: "Thank you for contacting us",
      htmlFile: mailUser.htmlfile,
      data: {
        fname,
        msg,
        email,
        company: "Rising Advisory Services Pvt Ltd",
        dt: new Date().getFullYear(),
        user: mailUser
      }
    });

    /* ================= SEND MAIL TO ADMIN ================= */
    await sendMail({
      to: mailUser.self,
      subject: "Acknowledgement Mail",
      htmlFile: "selfmail.html",
      data: {
        fname,
        email,
        mobile,
        msg,
        company: "Rising Advisory Services Pvt Ltd",
        dt: new Date().getFullYear(),
        user: mailUser
      }
    });

    return res.status(201).json({
      message: "Data saved & mail sent successfully"
    });

  } catch (err) {
    await new APIError({
      email: req.body?.email || "N/A",
      errdesc: err.message
    }).save();

    console.error("Controller Error:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};

