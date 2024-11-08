const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const {imageUploadToCloudinary} = require("../utils/imageUploader");


//Create Profile 
exports.createProfile = async (req, res) => {
  try {
    const { userId, phoneNumber, gender, dateOfBirth, about } = req.body;

    //create entry in DB
    const profileDetails = await Profile.create({
      gender,
      dateOfBirth,
      about,
      phoneNumber
    });

    //Update section with this subSection Object ID
    const updateUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: { subSections: profileDetails._id }
      },
      { new: true }
    ); // HW: add populate

    return res.status(200).json({
      success: true,
      profile: updateUser,
      message: "Profile created successfully"
    });
  } catch (err) {
    console.log("Error in createProfile : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, while creating profile",
      err: err.message
    });
  }
};

//Update Profile 
exports.updateProfile = async (req, res) => {
  try {
    //about = " ": the about variable is assigned the value of req.body.about if it exists, and if it doesn't,
    // it is assigned the default value of an empty string (" ").
    console.log("Request Body in Profile Controller: ",req.body)
    const { firstName, lastName, phoneNumber, gender, dateOfBirth, about = " " } = req.body;
    // console.log("Gender: ",gender, " Dateof birth: ",dateOfBirth, " About: ",about);
    if (!gender || !dateOfBirth || !about ||!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "All fields are required"
      });
    }

    //get userId
    const userId = req.user.id; //->> if user loggedIn then find Id from JWT token >> see auth.js file in middelware

    //validation
    if (!userId) {
      return res.json({
        success: false,
        message: "UserId not found"
      });
    }

    //find ProfileId
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.json({
        success: false,
        message: "No such user exists."
      });
    }
    const profileId = userDetails.additionalDetails;

    //create/update a new profile
    let updatedProfile = await Profile.findOneAndUpdate(
      { _id: profileId },
      {
        $set: {
          gender: gender,
          dateOfBirth: dateOfBirth,
          about: about,
          phoneNumber: phoneNumber
        }
      },
      { new: true }
    );
  
    let updatedUserDetails = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          firstName: firstName,
          lastName: lastName
        }
      },
      { new: true }
    ).populate('additionalDetails');


    //send response
    return res.status(201).json({
      success: true,
      message:"Profile Updated successfully",
      data: updatedProfile,
      updatedUserDetails: updatedUserDetails
    });
  } catch (err) {
    console.log("Error in updateProfile : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, while Updating profile",
      err: err.message
    });
  }
};

// @route   DELETE api/profile/deleteProfile
//HW: How to Schedule the API request  --> I want to delete Profile but not immediately, after 3 days of User invoke delete handler
//Explore-How can we schedule this deletion operation --> node-schedule
//Delete Profile Controller  // delete User Profile and User iself except Admin
exports.deleteProfile = async (req, res) => {
  try {
    //get Id
    const id = req.user.id;
    const userDetails = await User.findById({_id:id});

    //validation
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    //delete profile
    await Profile.findOneAndDelete({ _id: userDetails.additionalDetails });

    //  Delete Assosiated Profile with the User
    //  await Profile.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(userDetails.additionalDetailes)})

    //TODO-HW:unenrolled(dis-enrolled) user from all enrolled course (Important)
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        {_id:courseId},
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }

    //Delete User -- implement the user will not delete immediately but after 3 days
    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.log("Error in updateProfile : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, while deleting profile",
      err: err.message
    });
  }
};

//getAllUserDetails
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    //-->  populate is used to get the data of other Object collection which is related with Ohject collection
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Details fetched Successfully!",
      data:userDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error, while Updating profile",
      err: err.message
    });
  }
};


//update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await imageUploadToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image);
    
    //Update the database with new Image URL
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { images: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//Get Enrolled Courses by Students
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      }).exec();

      console.log("User-Details in Profile Controller line No-251: ", userDetails )

    userDetails = userDetails.toObject();

    var SubsectionLength = 0;

    for (var i = 0; i < userDetails.courses.length; i++) {

      let totalDurationInSeconds = 0;

      SubsectionLength = 0;

      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
      }

      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}



exports.instructorDashboard = async (req, res) => {

  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {

      const totalStudentsEnrolled = course.studentsEnrolled.length;

      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats;

    })

    res.status(200).json({ courses: courseData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" })
  }
}
