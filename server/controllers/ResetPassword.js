const User = require("../models/User");
const EmailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//ResetPasswordToken --> Authorize the user and send email with reset link
exports.resetPasswordToken = async (req, res) => {
  try {
    //Get email from req body
    const email = req.body.email;
    //email validation
    if (!email) return res.status(400).send({ error: "Email is required" });

    //Find user by email 
    // let user = await User.findOne({ where: { email } });
    const user = await User.findOne({email:email});

    if (!user)
      return res.status(400).json({
        success: false,
        error: `User not found for this email`
      });

    //Token Generated using crypto.randomUUID( ) method of crypto module in nodejs
    const token = crypto.randomUUID();

    //Update User by adding token and expiration time
    const updatedDetailes = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000 //10 min
      },
      { new: true } // For to return updated document
    );

    console.log("updatedDetails of User: ", updatedDetailes);

    //Create URL
    const URL = `http://localhost:3000/reset-password/${token}`;

    //Send mail containing the URL
    await EmailSender(
      email,
      "Reset-Password link",
      `Password-Reset Link: ${URL}`
    );

    //return response
    return res.status(200).json({
      success: true,
      message: `Email Send Successfully, please check the email and change your password`
    });
  } catch (err) {
    console.log("Error while reset-password:", err);
    return res.status(403).json({
      success: false,
      message: "Error while resetPasswordToken: " + err.message
    });
  }
};




//ResetPassword --> save new password in database
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    //Check validation for Password & Confirm Password
    if (!password || !confirmPassword) {
      throw new Error("Please provide both fields");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    //Get user by Token from Database
    const user = await User.findOne({ token: token });

    //If no user found with this token or expired
    if (!user) {
      throw new Error("Invalid or Expired Token");
    }

    //token time check
    if (user.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Your Token is Expired, Please Generate Your Token"
      });
    }
    //Encrypting the Password using Bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    //Update the new Password to the User's Document
    user.password = hashedPassword;
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    //Save the updated user document into the database
    await user.save();

    // or
    // await User.findOneAndUpdate({ token: token }, { password:hashedPassword}, {new:true});

    return res.status(200).json({
        success: true,
        message:"Password has been Reset Successfully!"
    })
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
        success: false,
        message: err.message
    })
  }
};

