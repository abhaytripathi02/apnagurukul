const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60   // The document will be automatically deleted after 5 minutes of its creation time
  },
  
});


// Create function to send mail
async function sendVerificationEmail(email, otp) {
          try{

            const mailResponse = await mailSender(email,"Your Verification Code",emailTemplate(otp));
            console.log("Email Sent Successfully", mailResponse);

          }
          catch(err){
            console.log("Error Occure while sending verification Email", err);
            throw err;
          }
};


//pre - hook/middleware used : // What is the meaning of next() here.
otpSchema.pre("save", async function(next){
        console.log("pre-middleware in OTP model")
        await sendVerificationEmail(this.email, this.otp);
        next();  // --> go to next middleware
});



module.exports = mongoose.model( "OTP", otpSchema );