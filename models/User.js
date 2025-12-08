const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    msg: {
      type: String,
      required: true
    },
	createdOn: {
    type: Date,
    default: Date.now  
    }
  }
);

module.exports = mongoose.model("APIUser", userSchema);
