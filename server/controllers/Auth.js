const User = require("../models/User");
const OTP = require("../models/otp");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//<-----sendOTP Handler---->
exports.sendOTP = async (req, res) => {

  try {
    // const email = req.body.email;
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "You are already registered"
      });
    }
   
   
    // Generate OTP
    let otpValue = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    console.log(`Generated OTP is: ${otpValue}`);
   

    //check unique otp exist or not in db   ->> Why Problem ?
    let result = OTP.findOne({ otp: otpValue });
    console.log("Bug");

    // Logic sahi kar yaha per
    while (result) {
      let otpValue = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      });
      result = await OTP.findOne({ otp: otpValue });
    }
    console.log("Error identifed in SEND OTP Controller-2")

    //newOtp object is created using OTP model --> save the OTP to database with expiry of 5 minutes from now
    // const newOtp = new OTP({
    //   email: email,
    //   otp: otpValue,
    //   createdAt: Date.now()
    // });
    // await newOtp.save();

    //create an entry in DB
    //const otpPayload = { email, otpValue };
    const optBody = await OTP.create({
      email: email,
      otp: otpValue
    });

    // optBody.save();  // not required as we have used await before creating a record
    // console.log("OTP BODY: ", optBody);

    // return response with status code and message
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully"
    });

    // Send mail with generated OTP --|or|-- use pre hook of mongoose with 'save method
 
  } catch (error) {

    console.log("Error in sendOtp: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

//<-----signUp handler----->
exports.signUp = async (req, res) => {
  try {
    // data fetch from request body

    const {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType,
      otp
    } = req.body;

    //validate data --> email and phone number validation

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all the details"
      });
    }

    //match both password
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Both Password must be same. try again!"
      });
    }
    // console.log("<------- Sign Up after OTP ---->")
    //check if user already exist or not
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue."
      });
    }

    //find most recent OTP stored for the user
    //let otpRecord = await OTP.findOne().sort({_id:-1}).where('email',email);

    const recentOtp = await OTP.findOne({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent OTP- ", recentOtp);

    //Validate OTP ------->
    if (recentOtp == null) {
      // otp not found
      return res.status(401).json({
        success: false,
        message: "OTP Not Found"
      });
    } else if (recentOtp.otp != otp) {
      //if OTP is not matched with the provided one then send an error response to the client
      return res.status(400).json({
        success: false,
        status: "fail",
        message: "OTP doesnot match, wrong OTP entered! Try Again."
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create entry in DB  //-- showing error path is required
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      phoneNumber:null
    });

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      accountType: accountType,
      additionalDetails: profileDetails._id,
      images: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      active: true
    });

    //return response
    return res.status(200).json({
      success: true,
      id: user._id,
      user: user,
      message: `User ${user.firstName} has been registered successfully`
    });
  } catch (err) {
    console.log("Error in signUp Handler :", err);
    return res.status(500).json({
      success: false,
      message: "Server error while signUp"
    });
  }
};

//<-----Login Handler---->
exports.userLogin = async (req, res) => {
  try {
    //fetch input data from request body
    const { email, password } = req.body;

    //Input data Validation
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Enter all the fields, please try again!"
      });
    }


    //check user exist or not
    let existUser = await User.findOne({ email: email }).populate("additionalDetails").exec();


    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "This E-mail address is not registered, Please! signUp first"
      });
    }

    //Match Password   -- Important 
    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!"
      });
    }

    //Generate JWT(jsonWebToken), after matching password
    const payload = {
      email: existUser.email,
      id: existUser._id,
      accountType: existUser.accountType
    };

    // Token expires due to this line of code expiresIn:'2hr'
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h"
    });

    // existUser.toObject(); // use this if below code is not working
    existUser.token = token;
    existUser.password = undefined; //why?? --> remove password field from user object because password is sensitive data

    //create cookie and send response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 days
      httpOnly: true
    };

    //localStorage.setItem("token", token); // or use cookies

    res.cookie("token", token, options).status(200).json({
      sucess: true,
      token: token,
      user: existUser,
      message: "Logged In successfully"
    });
  } catch (err) {
    console.log("Error in Login handler : ", err);
    return res.status(500).json({
      success: false,
      message: "Server error while login"
    });
  }
};


//<-----ChangePassword---->
exports.changePassword = async (req, res) => {
  try {
    //feteh data from request body --> oldPassword, newPassword, confirmNewPassword are required fields
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    
    const email = req.user.email;

    //Validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please! try again, fill all the field carefully"
      });
    }

    //Update Password in DB
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account with this email found"
      });
    }

    console.log("User at passwordChange-1:  ", user);
    console.log("User Password: ", user.password);

    //Checking Old password is correct or not
    var checkOldpass = await bcrypt.compare(oldPassword, user.password);

    if (!checkOldpass) {
      return res.status(401).json({
        success: false,
        message: "Your Current Password is wrong !"
      });
    }

    //Checking New and Confirm Password are same or not
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "The New password does not match."
      });
    }

    //Encrypt The New Password
    latestPassword = await bcrypt.hash(newPassword, 10);

    //Updating the new password to database
    //Difference between - findOneAndUpdate(): it will return the user object and updateOne(): It will not return the user object
    user = await User.findOneAndUpdate(
      { _id: user._id },
      { password: latestPassword },
      {new:true}
    );

    //send Email to user --> password changed successfully
    console.log("User is console log at Auth.js in line-329:", user);
    try {
      await mailSender(
        email,
        "Password for your account has been updated",
        passwordUpdated(email, `${user.firstName} ${user.lastName}`)
      );
    } catch (err) {
      console.log("Error while sending Email ");
    } 

    //return response
    return res.status(200).json({
      success: true,
      message: "Password has been changed Successfully"
    });
  } catch (err) {
    console.log("Error in Change Password Handler : ", err);
    return res.status(500).json({
      sucess: false,
      message: "Server Error! Can't change the password."
    });
  }
};

// bcrypt.hashSync() - is used to Synchronously generates a hash for the given string. It returns the hashed string
// bcrypt.hash() - is used for Asynchronously generating a hash for the given string.
// It returns promise is callback is committed and you need to resolve the promise.
