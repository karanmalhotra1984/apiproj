const mongoose = require("mongoose");

const apierrorSchema = new mongoose.Schema(
  {
    
    email: {
      type: String,
      required: true
    },
	errdesc:{
		type: String,
      required: true		
	},
	createdOn: {
    type: Date,
    default: Date.now  
  }
  }
);

module.exports = mongoose.model("APIError", apierrorSchema);
