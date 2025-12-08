const User = require("../models/User");
const APIError = require("../models/APIError");
const DBEntry = require("../models/DBEntry");
const sendMail = require("../utils/sendMail");


// GET /api/users
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST /api/users/add
exports.addUser = async (req, res) => {

const {fname,email,mobile,msg} = req.body;   // correct way


try {  

	//save user information


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

    //send mail to user

	sendMail({
		to: email,
		subject: "Thank You for contacting us",
		htmlFile: "mail.html",
		data: {
		fname,
		msg,
		company: "Rising Advisory Services Pvt Ltd",
        dt: new Date().getFullYear()
			}
	});

    //send mail to self
    
	sendMail({
	  to: "kmttacademy@gmail.com",
	  subject: "Acknowledgement Mail",
	  htmlFile: "selfmail.html",
	  data: {
		fname,
		email,
		company: "Rising Advisory Services Pvt Ltd",
	    dt: new Date().getFullYear()
		}
    });

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
exports.getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
};