const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const imageUploader = require("../utils/imageUploader");
const Section  = require("../models/Section");
const SubSection  = require('../models/SubSection');

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
      tags,
      requirements
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
      !tags ||
      !requirements
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
      tags: tags,
      courseRequirements: requirements
    });

    newCourse.populate('category');
    
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
      // .populate("RatingAndReviews")
      .populate({ path: "category" })
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


// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body;
    console.log("updates: ", updates);

    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update", req.files)
      const thumbnail = req.files.thumbnail_Img;

      // upload thumbnail to cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // understand this logic 
    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tags" || key === "courseRequirements") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]   // course.key = updates.key
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("RatingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;


    // Find the course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;

    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;

    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}


exports.getInstructorCourses = async (req, res) => {
  try {

    // token contains - email, accountType, userId
    const {email, id} = req.user;
    
    if(!id){
      return res.status(401).json({success: false, message: "Unauthorized, id not found"})
    }

    const getUser = await User.findById(id).populate("courses");

    if(!getUser){
      return res.status(404).json({success: false, message: "User not found"})
    }
    
    if(getUser.accountType !== 'Instructor'){
      return res.status(403).json({success: false, message: "Forbidden, only instructors"})
    }

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: getUser.courses
    })

  } catch (error) {
     console.log(error);
     return res.status(500).json({
      success: false,
      error:error.message,
      message: "Server error while fetching Courses",
     })
  }
}