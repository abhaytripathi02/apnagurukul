const { instance } = require("../config/Razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")

const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress");

require("dotenv").config();


// initiate the payment-order 
exports.capturePayment = async(req, res) =>{
    const {courses} = req.body;
    const userId = req.user.id;
    
    if(courses.length == 0){
      return res.json({success:false, message: "Please provide Course ID"})
    }

    let totalAmount = 0;

    for( const course_id of courses){
      try{
        const courseDetails = await Course.findById(course_id);
        if(!courseDetails){
          return res.json({success:false, message: "Course not found"})
        }

        // check user already enrolled or not 
        const uid =  new mongoose.Types.ObjectId(userId);
        const userEnrolled = courseDetails.studentsEnrolled.some(
          (enrolledId) => enrolledId.equals(uid)
        );
        
        if(userEnrolled){
          return res.json({success:false, message:"User Already Enrolled in the course", data:courseDetails.courseName});
        }
        console.log("Course-Details:", courseDetails);
        totalAmount =  totalAmount + courseDetails.price  
      }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: error.message})
      }
    }

   
    const MAXIMUM_ALLOWED_AMOUNT = 1000000;

    if ((totalAmount * 100) >= MAXIMUM_ALLOWED_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Total amount (${totalAmount}) exceeds the maximum allowed amount.`
      });
    }
    

    const options = {
      amount: totalAmount * 100, // amount is in paise
      currency: 'INR',
      receipt: Math.random(Date.now()).toString()
    }
    // create order 
    try {
     
     

      const paymentResponse = await instance.orders.create(options);
      
      console.log("Debugger at payment controller line-63: ", paymentResponse);
      

      res.json({
        success:true,
        message:paymentResponse 
      });

    } catch (error) {
       console.log("Error in payment capture section: ",error);
       res.status(500).json({
        success:false,
        message:"Could Not Initiate Order",
        error: error.description
       })
    }
}


// verify payment
exports.verifyPayment = async(req, res) => {


  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;

  const courses = req.body?.courses;
  const userId = req.user.id;
  const email = req.user.email;


  
  // validation
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }
  
  //Payment Verification Logic
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

  if(expectedSignature === razorpay_signature){
          
          try {
            await enrollStudent(courses, userId, email, res);
             
            return res.status(200).json({success: true, message:"Payment Verified"});
            
          } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({success: false, message:"Payment Failed to Verify"});
          }
         
  } 

   return res.status(500).json({success: false, message:"Payment Failed to Verify"});

}


// Enroll the Student & Course
const enrollStudent = async(courses, userId, email, res) => {
                const courseNamedata = [];
               
                // Enroll the Course 
                for(const course_id of courses){

                     
                    try {
                         
                          //courseProgress is created
                          const courseProgress = await CourseProgress.create({
                            courseID: course_id,
                            userId: userId,
                            completedVideos: [],
                          });


                          // Enroll student into course
                          const enrolledCourse = await Course.findByIdAndUpdate(
                            {_id: course_id},
                            { $push: { studentsEnrolled: userId} },
                            { new: true }
                          )   

                        courseNamedata.push(enrolledCourse.courseName);
                          
                          if(!enrolledCourse){
                            return res.status(500).json({success:false, message: "Course not found"})
                          }

                          // Enroll Course into Student
                          const enrolledUser = await User.findByIdAndUpdate(
                            userId, // directly pass the userId
                            {
                              $push: {
                                courses: course_id,
                                courseProgress: courseProgress._id
                              }
                            },
                            { new: true } // returns the updated document
                          );
                          
                          if(!enrolledUser){
                            return res.status(500).json({success:false, message: "User not found"});
                          }
                    } catch (error) {
                        console.log("Error in Verify Payment section: ", error);
                    }
                }
                
              const enrolledCoursesName = courseNamedata.map(course => course).join(', '); 
             
              const userDetails = await User.findById(userId);

              try {
                // send mail to student 
                await mailSender( userDetails.email, courseEnrollmentEmail( enrolledCoursesName, userDetails.firstName));               
              } catch (error) {
                console.log("Error while sending Email: ", error);
                console.error(error.message);
              } 
}


// // Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}



