/*Sets up email sender configuration
Like setting up your email client
but in code */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to,subject,html) => {
  try{
    await transporter.sendMail({
      from: `"Gold Karigor Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  }catch (error) {
    console.error(`Email Error: ${error.message}`);
  }
};

module.exports = sendEmail;