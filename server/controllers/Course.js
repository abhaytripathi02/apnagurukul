const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const imageUploader = require("../utils/imageUploader");

require("dotenv").config();

//create Course handler
exports.createCourse = async (req, res) => {
  try {
    //fetch data from the body of request
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tags
    } = req.body;

    //get thumnail image
    const thumbnail = req.files.thumbnail_Img;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !tags
    ) {
      return res.status(401).json({
        success: false,
        message: "All Fields are required"
      });
    }

    // fetch instructor UserId
    const userId = req.user.id; //->> See Payload of JWT token so, fetch from there --> see, login Handler and auth_middleware handler
    //fetch Instructor details from DB
    const instructorDetails = await User.findById({ _id: userId });

    // TODO: Verify that userId and instructor._id are same or different ?

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found"
      });
    }

    //check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "This Category not found, try another category"
      });
    }

    //Upload Image in Cloudinary
    const thumbnailImage = await imageUploader.imageUploadToCloudinary(thumbnail,process.env.FOLDER_NAME);
    if (!thumbnailImage) {
      return res.json({
        success: false,
        message: "Thumbnail Image Upload Failed!"
      });
    }

    //create entry in DB for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      instructor: instructorDetails._id,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tags: tags
    });

    //add the new course to the UserSchema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id
        }
      },
      { new: true }
    );

    //Update the category Schema  -->> HW: TODO
    await Category.updateOne(
      { _id: categoryDetails._id },
      {
        $push: { courses: newCourse.id },
        $inc: { numberOfCourses: 1 }
      }
    );

    //Response
    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Intenal Server error while creating course",
      error: error.message
    });
  }
};

//fetch All Course
exports.getAllCourses = async (req, res) => {
  try {
    //TODO: Understand the below code with populate()
    const allCourse = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        courseContent:true,
        instructor: true,
        RatingAndReviews: true,
        studentEnrolled: true
      }
    )
      .populate("instructor")
      .populate("courseContent")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All Courses data are fetched Successfully",
      data: allCourse
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong can't fetch courses",
      error: error.message
    });
  }
};

//getcourseDetails(for single course only)
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    //find course
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({ path: "instructor", populate: { path: "additionalDetails" } })
      .populate("RatingAndReviews")
      .populate({ path: "categoryId" })
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could Not find the Course ${courseId}`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Course details fetched Successfully`,
      data: courseDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Could not found Course`,
      error: error.message
    });
  }
};

//Delete_Course

//Update/Edit_Course Details
