// Importing necessary modules and packages
const express = require("express");
const app = express();

//import routes
const userRoutes = require("./routes/userAuth");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");

//import database connection
const database = require("./config/database");
//Initialize middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.dbconnect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true
    // tempFileDir: "/tmp/"
  })
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes // mounting the route
app.use("/api/v1/auth", userRoutes); 
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Testing the server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ..."
  });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});



// Q. Demonstrate the concept of promise
// const fetchData = () =>{
//   // returing the promise
//   return new Promise((resolve, reject) => {
//     fetch('https://jsonplaceholder.typicode.com/posts')
//     .then((response)=> response.json)
//     .then((data)=> resolve(data))
//     .catch((error)=>reject(error))
//     .finally(()=> console.log('Finally statement is running'))
//   });
// };
// // fetching data 
// fetchData().then(data => console.log(data)).catch(error => console.error(error));

// ----------------------------------------< End of code >----------------------------------------------

// -------------------------------< Cookie-parser >---------------------------------------
/*'cookie-parser' is a middleware for Express.js, a popular web application framework for Node.js. 
This middleware parses cookies attached to the client request object (req.cookies) and makes them available for easy access within your Express application.

1. Parsing Cookies:- When a client makes a request to your Express server and sends cookies along with it, 
cookie-parser middleware parses those cookies and extracts them from the request headers.

2. Accessing Cookies:- Once parsed, the middleware makes the cookies available in the req.cookies object,
where you can access them conveniently in your route handlers or other middleware functions.

3. Setting and Modifying Cookies: Although cookie-parser primarily focuses on parsing cookies from incoming requests, it can also be used to set or modify cookies for outgoing responses.  */

//-------------------< CORS (Cross-Origin Resource Sharing (CORS) restrictions) >------------------------------
/* The cors() middleware is used in Express.js applications to handle Cross-Origin Resource Sharing (CORS) restrictions. CORS is a security feature implemented by web browsers to prevent unauthorized access to resources on a web server from a different origin (domain, protocol, or port).

When you make a request from a client-side JavaScript application to a server, the browser checks whether the server allows requests from the origin of the requesting page. If the server does not explicitly allow requests from that origin, the browser blocks the request as a security measure.

"[Cross-origin requests occur when a web application hosted on one domain (origin) makes a request to a server on a different domain. Browsers, by default, restrict such requests for security reasons, to prevent malicious scripts from accessing resources on different origins without permission. However, there are legitimate use cases where you might want to allow such requests, such as when building a web API that needs to be accessed by clients from different origins]"

1.Handling CORS Preflight Requests:
2.Setting CORS Headers: 
3.Simplifying CORS Configuration:
*/

//<-------- Configuring CORS Asynchronously------->>
// var cors = require('cors')
// var allowlist = ['http://example1.com', 'http://example2.com']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
// app.get('/products/:id', cors(corsOptionsDelegate), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for an allowed domain.'})
// })

// https://drivetot.cyou/pack/679866468301  -- maamla legal hai

// git branch
// git branch  new_branchName
// git checkout  new_branchName  // -->({ switched to branch 'new branch })<--

/// feature
/// 1. add product from admin panel
/// 2. delete product from admin panel
/// 3. edit product details from admin panel
/// 4. view all products from admin panel
/// 5. search product by name or sku from admin panel
/// 6. filter product by category from admin panel
/// 7. upload image of product from admin panel
/// 8. assign tags to product from admin panel
/// 9. assign attributes to product from admin panel
/// 10. set price range for a particular tag / attribute combination




//  Javascript HTML Template
//  JavaScript function that generates an HTML email template:-
// {% comment %} 1.Define the Structure
// {% comment %} 2.Write the JavaScript function 
// {% comment %} 3.Handle dynamic content 
// {% comment %} 4.Export the function (if using Node.js)  