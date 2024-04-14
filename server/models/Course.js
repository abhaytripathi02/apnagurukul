
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true
  },                 
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  whatYouWillLearn: {
    type: String
  },
  price: {
    type: Number
  },
  thumbnail: {
    type: String
  },
   // courseContent is used to store Multiple-Section in Particular course
  courseContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
    }],

  RatingAndReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingAndReview"
    }],
    
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  
  tags:{
    type: [String],
    required: true,
  },

  studentsEnrolled:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],

    // How to implement this ? Write business logic for different state of Courses 
  status: {
    type: String,
    enum: ["Draft","Pending","Published"],
  },

  createdAt: { 
    type: Date,
    default: Date.now 
  },

});


module.exports = mongoose.model("Course", CourseSchema);

// MongoDB, the trim:true property is used in schema definitions to specify whether string values should be trimmed (have whitespace removed from the beginning and end) before being stored in the database.
