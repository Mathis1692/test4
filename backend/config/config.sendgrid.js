const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set your API key from environment variables for security
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create reusable email service
const emailService = {
  // Send a simple email
  sendEmail: async (to, subject, text, html) => {
    const msg = {
      to,
      from: process.env.FROM_EMAIL, // Your verified sender email
      subject,
      text,
      html,
    };
    
    try {
      const response = await sgMail.send(msg);
      return { success: true, response };
    } catch (error) {
      console.error('SendGrid Error:', error);
      if (error.response) {
        console.error('Error Response Body:', error.response.body);
      }
      return { success: false, error: error.message };
    }
  },
  
  // Send a template-based email
  sendTemplateEmail: async (to, templateId, dynamicTemplateData) => {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      templateId,
      dynamicTemplateData,
    };
    
    try {
      const response = await sgMail.send(msg);
      return { success: true, response };
    } catch (error) {
      console.error('SendGrid Template Error:', error);
      if (error.response) {
        console.error('Error Response Body:', error.response.body);
      }
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;