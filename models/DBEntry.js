const mongoose = require("mongoose");

const dbentrySchema = new mongoose.Schema(
  {
    
    userid: {
       type: mongoose.Schema.Types.ObjectId,
      required: true
    },	
	origin: {
		type: String,
      required: true		
	},
	referer: {
		type: String,
      required: true		
	},	
	originalUrl: {
		type: String,
      required: true		
	},
	method: {
		type: String,
      required: true		
	},
	createdOn: {
    type: Date,
    default: Date.now  
    }
  }
);

module.exports = mongoose.model("DBEntry", dbentrySchema);
