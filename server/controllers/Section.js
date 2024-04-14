const Section = require("../models/Section");
const Course = require("../models/Course");

// Create Section Handler
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    console.log("sectionName: ", sectionName, " CourseId: ", courseId);
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Parameter"
      });
    }

    //create new section
    const newSection = await Section.create({ sectionName });

    // Update Course with section ObjecId
    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id
        }
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection"
        }
      })
      .exec();

    //response
    return res.status(200).json({
      success: true,
      message: "Section Created Successfully",
      updatedCourse
    });
  } catch (error) {
    console.log("Error-->", error);
    return res.status(404).json({
      success: false,
      message: "Error While creating section",
      error: error.message
    });
  }
};

//Update Section Handler
exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName } = req.body;

    //validation
    if (!sectionId || !sectionName) {
      return res.status(401).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const updatedSectionDetails = await Section.findOneAndUpdate(
      {_id:sectionId} ,
      { sectionName },
      { new: true }
    );
   console.log("UpdatedSection:-->", updatedSectionDetails)
    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully!",
      data: updatedSectionDetails
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
      error: error.message
    });
  }
};

//Delete Section Handler
exports.deleteSection = async (req, res) => {
  try {
    //get-ID assuming that we are sending
    const { sectionId, courseId } = req.params;
    // const { sectionId, courseId } = req.body;

    await Section.findByIdAndDelete({ sectionId });
    //TODO:[Testing Time] Do we need to delete entry from the Course Schema
    // Course ko update karo

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
      error: error.message
    });
  }
};
