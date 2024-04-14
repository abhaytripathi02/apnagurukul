const cloudinary = require("cloudinary").v2;
const express = require("express");
const fs = require("fs");

function isFileSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

exports.imageUploadToCloudinary = async (file, folder, height, quality) => {
  try {
    if (!file || !folder) {
      return Promise.reject("No image or folder provided");
    }

    //Validation (supported type)
    const supportedType = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isFileSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "File Format Not Supported"
      });
    }

    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";

    //cloudinary function to upload image file
    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );
   
    //deleting temporary file from local Server after it has been uploaded to the cloud server
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
        console.error("Error deleting temporary file:", err);
        return res
          .status(500)
          .send("Internal Server Error while file unlinking");
      }
    });

    return response;
    
  } catch (error) {
    console.log("Error occurs in imageUploader: ",error);
  }
};




exports.videoUploadToCloudinary = async (file, folder, height, quality) => {
  try {
    if (!file || !folder) {
      return Promise.reject("No video or folder provided");
    }

    //Validation (supported type)
    const supportedType = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isFileSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "File Format Not Supported"
      });
    }

    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";

    //cloudinary function to upload image file
    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );
   
    //deleting temporary file from local Server after it has been uploaded to the cloud server
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
        console.error("Error deleting temporary file:", err);
        return res
          .status(500)
          .send("Internal Server Error while file unlinking");
      }
    });

    return response;
    
  } catch (error) {
    console.log("Error occurs in videoUploader: ",error);
  }
};
