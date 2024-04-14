const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: { type: String, required: true, unique: true },

  password: { type: String, required: true, trim: true },

  accountType: {
    type: String,
    enum: ["Admin", "Instructor", "Student"],
    required: true
  },
  images: {
    type: String,
    required: true
  },
  
  active: {
    type: Boolean,
    default: true,
  },

  token:{
    type: String,
  },
  resetPasswordExpires:{
     type: Date,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  },

  courses: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course"
    }],

  courseProgress: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseProgress"
    }]

},
// Add timestamps for when the document is created and last modified
{ timestamps: true }
);


module.exports = mongoose.model("User", userSchema);


