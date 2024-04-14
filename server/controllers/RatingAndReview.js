const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // Check if the user is enrolled in the course

    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } }
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course"
      });
    }

    // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course already reviewed by user"
      });
    }

    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId
    });

    // Add the rating and review to the course
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          RatingAndReviews: ratingReview._id
        }
      },
      { new: true }
    );

    // await courseDetails.save()

    return res.status(201).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingReview
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

//What is Aggregation in MongoDB ->>

// Get the average rating for a course
exports.getAverageRating = async (req, res) => {
  try {
    // const courseId = req.params.courseid
    const courseId = req.body.courseId;

    // Calculate the average rating using the MongoDB aggregation pipeline
    const pipeline = [
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId) // Convert courseId(String) to ObjectId
        }
      },

      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ];
    const result = await RatingAndReview.aggregate(pipeline);

    // const result = await db.collection('reviews').aggregate(pipeline).toArray(); //->>  Use this if you are not using Mongoose

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating
      });
    }

    // If no ratings are found, return 0 as the default rating
    return res.status(200).json({ success: true, averageRating: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message
    });
  }
};

// Get all rating and reviews
exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image" // Specify the fields you want to populate from the "Profile" model
      })
      .populate({
        path: "course",
        select: "courseName" //Specify the fields you want to populate from the "Course" model
      })
      .exec();

    res.status(200).json({
      success: true,
      data: allReviews
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message
    });
  }
};

//Get All Rating and Review corresponding to Specific Course
exports.getCourseRatingReview = async (req, res) => {
  try {
    //fetch data
    const courseId = req.body.courseId;

    //Find all Review and rating using the MongoDB aggregation pipeline
    const pipeline = [
      {
        $match: {
          courseId: mongoose.Types.ObjectId(courseId) // Assuming courseId is an ObjectId
        }
      },
      {
        $project: {
          _id: 0, // if you want to exclude the _id field from the output, you can keep _id: 0 in the $project stage
          studentRating: "$rating",
          review: "$review"
        }
      }
    ];
    const courseDetails = await RatingAndReview.aggregate(pipeline).exec();
    // Note-TODO: I want to fetch Images and emails of the students using aggregation
    //-----------------------------------------e-----------------------//

    // const courseDetails = await Course.findById({ _id: courseId }).populate({
    //   path: "RatingAndReviews",
    //   select: "rating review"
    // });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found with Rating and Review"
      });
    }

    return res.status(200).json({
      success: true,
      RatingAndReviews: courseDetails.RatingAndReviews
    });
  } catch (error) {
    console.log("Rating and Review Not Found Error: ", error);
    return res.status(500).json({
      success: true,
      error: error.message
    });
  }
};


// The populate equivalent is achieved by using $lookup
// Example aggregation pipeline with populate
// CollectionA.aggregate([
//     {
//       $lookup: {
//         from: 'collectionB', // Target collection
//         localField: 'field2', // Field from the current collection
//         foreignField: '_id',   // Field from the target collection
//         as: 'field2Data'       // New field to store the populated data
//       }
//     },
//     {
//       $unwind: '$field2Data'  // If field2 is an array, you might want to unwind it
//     },
//     {
//       $project: {
//         _id: 1,
//         field1: 1,
//         'field2Data.field3': 1  // Project the fields you need from the populated collection
//       }
//     }
//   ])
//   .exec((err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(result);
//     }
//   });