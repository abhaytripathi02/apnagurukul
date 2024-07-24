const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");
const {
  createProfile,
  updateProfile,
  deleteProfile,
  getAllUserDetails,

  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
  adminDashboard
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes                                                   //
// ********************************************************************************************************

router.post("/createProfile", auth, createProfile);
router.delete("/deleteProfile", auth, deleteProfile);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses); 
//update profile picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

//--------------< [ Admin & instructor Dashboard ] >----------------------------
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);
// router.get("/adminDashboard", auth, isAdmin, adminDashboard) // TO DO- create admin dashboard

module.exports = router;
