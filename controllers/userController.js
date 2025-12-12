const User = require("../models/User");
const APIError = require("../models/APIError");
const DBEntry = require("../models/DBEntry");
const sendMail = require("../utils/sendMail");
const fs  = require("fs");

// GET /api/users
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST /api/users/add
exports.addUser = async (req, res) => {

const {fname,email,mobile,msg} = req.body;   // correct way


try {  


	if (!fname || !email || !mobile || !msg) {
      return res.status(400).json({ message: "All fields required!" });
    }

	const newUser = new User({
      fname,
      email,
      mobile,
      msg
    });    

	const savedUser = await newUser.save();
	const userid = savedUser._id;
	//save user information

     const origin = req.get("origin");
	 const referer = req.get("referer");
	 const originalUrl =  req.originalUrl;
	 const method = req.method;
 
	const dbEntry = new DBEntry({
		userid,
		origin,
		referer,
		originalUrl,
		method      
    });

   const savedEntry = await dbEntry.save();
      
   
    var htmlfile = "";
    var MAIL_USER="";
	var MAIL_PASS="";
	var MAIL_SMTP_HOST="";
	var MAIL_SMTP_PORT="";
	var MAIL_SERVICE="";
	var MAIL_SELF="";
    const config = JSON.parse(fs.readFileSync("./config/config.json", "utf8"));
    
   if(origin.includes("localhost"))
   {
	   
	   htmlfile = "Default.html";
	    MAIL_USER = config.DEFAULT[0].MAIL_USER; 
		MAIL_PASS = config.DEFAULT[0].MAIL_PASS; 
		MAIL_SMTP_HOST = config.DEFAULT[0].MAIL_SMTP_HOST; 
		MAIL_SMTP_PORT = config.DEFAULT[0].MAIL_SMTP_PORT; 
		MAIL_SERVICE = config.DEFAULT[0].MAIL_SERVICE;
		MAIL_SELF = config.DEFAULT[0].MAIL_SELF;
	   
   }
   if(origin === "https://credmanager.in")
   {
	   
	   htmlfile = "Credmail.html";
	    MAIL_USER = config.CREDM[0].MAIL_CREDM_USER; 
		MAIL_PASS = config.CREDM[0].MAIL_CREDM_PASS; 
		MAIL_SMTP_HOST = config.CREDM[0].MAIL_CREDM_SMTP_HOST; 
		MAIL_SMTP_PORT = config.CREDM[0].MAIL_CREDM_SMTP_PORT; 
		MAIL_SERVICE = config.CREDM[0].MAIL_CREDM_SERVICE;
		MAIL_SELF = config.CREDM[0].MAIL_CREDM_SELF;
	   
   }
   
    if(origin === "https://taxmanager.in")
   {
	   
	   htmlfile = "TaxMMail.html";
	    MAIL_USER = config.TAXM[0].MAIL_TAXM_USER; 
		MAIL_PASS = config.TAXM[0].MAIL_TAXM_PASS; 
		MAIL_SMTP_HOST = config.TAXM[0].MAIL_TAXM_SMTP_HOST; 
		MAIL_SMTP_PORT = config.TAXM[0].MAIL_TAXM_SMTP_PORT; 
		MAIL_SERVICE = config.TAXM[0].MAIL_TAXM_SERVICE; 
		MAIL_SELF = config.TAXM[0].MAIL_TAXM_SELF;
   }
   if(origin === "https://risingadvisory.com")
   {
	   
	   htmlfile = "Rising.html";
	   MAIL_USER = config.RISING[0].MAIL_RISING_USER; 
		MAIL_PASS = config.RISING[0].MAIL_RISING_PASS; 
		MAIL_SMTP_HOST = config.RISING[0].MAIL_RISING_SMTP_HOST; 
		MAIL_SMTP_PORT = config.RISING[0].MAIL_RISING_SMTP_PORT; 
		MAIL_SERVICE = config.RISING[0].MAIL_RISING_SERVICE; 
		MAIL_SELF = config.RISING[0].MAIL_RISING_SELF;
	   
   }
   if(origin === "https://riseit360.com")
   {
	   
	   htmlfile = "RiseIT.html";
	   MAIL_USER = config.RISEIT[0].MAIL_RISEIT_USER; 
		MAIL_PASS = config.RISEIT[0].MAIL_RISEIT_PASS; 
		MAIL_SMTP_HOST = config.RISEIT[0].MAIL_RISEIT_SMTP_HOST; 
		MAIL_SMTP_PORT = config.RISEIT[0].MAIL_RISEIT_SMTP_PORT; 
		MAIL_SERVICE = config.RISEIT[0].MAIL_RISEIT_SERVICE; 
		MAIL_SELF = config.RISEIT[0].MAIL_RISEIT_SELF;
   }

   
    //send mail to user

	sendMail({
		to: email,
		subject: "Thank You for contacting us",
		htmlFile: htmlfile,
		data: {
			MAIL_USER,MAIL_PASS,MAIL_SMTP_HOST,MAIL_SMTP_PORT,MAIL_SERVICE,MAIL_SELF,
		fname,
		msg,
		company: "Rising Advisory Services Pvt Ltd",
                dt: new Date().getFullYear()
			}
	});


    //send mail to self
    
	sendMail({
	  to: MAIL_SELF,
	  subject: "Acknowledgement Mail",
	  htmlFile: "selfmail.html",
	  data: {
		  MAIL_USER,MAIL_PASS,MAIL_SMTP_HOST,MAIL_SMTP_PORT,MAIL_SERVICE,MAIL_SELF,
		fname,
		email,
		company: "Rising Advisory Services Pvt Ltd",
	        dt: new Date().getFullYear(), 
		}
    });

	 
 
//throw new Error("Email is required", 422);

    res.status(201).json({ message: "Data Saved & Mail sent" }); 
  
   } catch (err) {
	   
	   const errdesc = err;
	   const newError = new APIError({      
       email,
       errdesc      
    });

   const savederror = await  newError.save();

	 
   //console.error("DB Error:", error.message);
    res.status(500).json({ error: err.message });
  }
  
};
// Optional: GET /api/users/:id
