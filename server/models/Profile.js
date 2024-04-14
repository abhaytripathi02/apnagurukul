const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    // type: Date,  //giving error but why?
    type: String  
  },
  about: {
    type: String
  },
  phoneNumber:{
    type: String,
  }
});

module.exports = mongoose.model("Profile", profileSchema);

// If you add { type: String, trim: true } to a field in your schema,
// then trying to save strings like "  hello", or "hello ", or "  hello ", would end up being saved as "hello"
// in Mongodb - i.e. white spaces will be removed from both sides of the string.
