const nodemailer = require("nodemailer");
const appError = require('./errorHandler');

const sendMail = async (message, user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Welcome to the _Bonezz",
      text: message,
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully:', info);

    return info;
  } catch (error) {
    
    const emailError = new appError('Mail could not be sent', 500);
    console.error('Email error:', error);
    throw emailError;
  }
};

module.exports = sendMail;