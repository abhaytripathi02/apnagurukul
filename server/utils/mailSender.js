const nodemailer = require("nodemailer");

require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD  //-> device password -> find in 2-step verification of Host mail
      }
    });

    let info = await transporter.sendMail({
        from: 'Apna Gurukul || by - Abhay Tripathi' ,
        to: `${email}` ,
        subject:  `${title}`,
        html: `${body}`,
    });

    console.log("Info of mail: ", info);
    return info;

  } catch (err) {
    console.log("Error in mailSender: ", err);
  }
};

module.exports = mailSender;
