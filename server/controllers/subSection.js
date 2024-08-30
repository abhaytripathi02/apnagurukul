const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const videoUploader = require("../utils/imageUploader");

//Create SubSection
exports.createSubSection = async (req, res) => {
  try {
    //data fetch
    const { sectionId, title, description} = req.body;
 
    console.log("backend debugging:", req.body);
    //extract file/video

    console.log("Video File path: ", req.files);
    const video  = req.files.video;

   
    //validation
    if (!sectionId || !title || !description) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong, Please send All the details"
      });
    }

    //upload video to cloudinary 
    const uploadDetails = await videoUploader.videoUploadToCloudinary(video,"apnagurukul");
    console.log("uploaded video details: ", uploadDetails)
    //create subSection
    const subSectionDetails = await SubSection.create({
      title: title,
      description: description,
      timeDuration: `${uploadDetails.duration}`,
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
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save() 

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

// Debug it !!
// exports.deleteSubSection = async(req, res) => {
//   try{
//     const{ subSectionId, sectionId} = req.body;  
   
//     // 1. I need to delete the SubSection document from the SubSection collection.
//     await SubSection.findByIdAndDelete({_id:subSectionId});
//     // [FindOut]- Do we need to delete entry from section schema or it will automatically deleted?
    

//     // 2. Update the Section to Remove the Reference:
//    const updatedSection  = await Section.findByIdAndUpdate({_id:sectionId},
//      {$pull: {subSection: subSectionId}},
//      {new: true}).populate("subSection");


//     return res.status(200).json({
//       success:true,
//       message:"SubSection deleted successfully",
//       data:updatedSection
//     })

//   }catch(error){
//     console.log("Error: ",error);
//     return res.status(400).json({
//       success:false,
//       message:"SubSection is failed to delete",
//       error:error.message
//     })
//   }
// }



exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
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
