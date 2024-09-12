const jwt = require("jsonwebtoken");
require("dotenv").config();


//auth - handler
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    // Verify the token - using secret key
    // Extract info from token(decode)
    try {
  
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token :", decode);

      req.user = decode;

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid"
      });
    }

    next(); //---> Goto next middleware

  }catch (err) {
    console.log("Error in auth middleware: ", err);
    return res.status(401).json({
      success: false,
      message: "Something wrong while validating the token in auth middleware",
      error: err
    });
  }
};


//isStudent
exports.isStudent = function(req, res, next) {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Protected Route for Students Only"
      });
    }

    next();
  } 
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verifed"
    });
  }
};


//isInstructor
exports.isInstructor = function(req, res, next) {
    try {
      if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
          success: false,
          message: "Protected Route for Instructor Only"
        });
      }
  
      next();
    } 
    catch (err) {
      return res.status(500).json({
        success: false,
        message: "User role cannot be verifed"
      });
    }
  };


//isAdmin
exports.isAdmin = function(req, res, next) {
    try {
      if (req.user.accountType !== "Admin") {
        return res.status(401).json({
          success: false,
          message: "Protected Route for Admin Only"
        });
      }
  
      next();
    } 
    catch (err) {
      return res.status(500).json({
        success: false,
        message: "User role cannot be verifed"
      });
    }
  };
