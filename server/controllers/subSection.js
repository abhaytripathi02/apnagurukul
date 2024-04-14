const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const videoUploader = require("../utils/imageUploader");

//Create SubSection
exports.createSubSection = async (req, res) => {
  try {
    //data fetch
    const { sectionId, title, description, timeDuration } = req.body;
 
    //extract file/video
    const video  = req.files.videoFile;

   
    //validation
    if (!sectionId || !title || !description || !timeDuration) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong, Please send All the details"
      });
    }

  
    //upload video to cloudinary 
    const uploadDetails = await videoUploader.videoUploadToCloudinary(video,"apnagurukul");

    //create subSection
    const subSectionDetails = await SubSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url
    });

    //Update section with this subSection Object ID
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: { subSection: subSectionDetails._id }
      },
      { new: true }
    ).populate({ path: "subSection" }).exec();
   
  
    //HW:TODO- log updated section here, after adding populate query
    
    //response
    return res.status(200).json({
      success: true,
      message: "Sub-Section created Successfully",
      updatedSection
    });

  } catch (error) {
    console.log("Error: ", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server  Error!",
      error: error.message
    });
  }
};


//HW: Update Subsection Handler
exports.updateSubSection = async(req, res) => {
    try {
      
    } catch (err) {
      
    }
} 

//HW: Delete Subsection Handler
exports.deleteSubSection = async(req, res) => {

}

//HW: Get_SubSection Handler
exports.getSubSection = async(req, res) => {
try {
   
} catch (error) {
  console.log("Error: ",error);
  return  res.status(500).json({
    success:false,
    message:"Server Error",
    error: error.message
})
}
}
