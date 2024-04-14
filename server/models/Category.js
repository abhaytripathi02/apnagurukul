const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },
  numberOfCourses:{
     type: Number,
     default: 0,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);
