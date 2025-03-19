const nodemailer = require('nodemailer');

// This is a simplified email service for demo purposes
// In production, you would use a proper email service provider
const sendEmail = async (to, subject, text, html) => {
  try {
    // For development, log the email instead of sending it
    console.log('------ EMAIL NOTIFICATION ------');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log('-------------------------------');
    
    // In production, you would use something like:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    return info;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };