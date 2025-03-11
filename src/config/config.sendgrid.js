import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Remove this if dotenv is already configured in server.js
dotenv.config();

// Create reusable email service
const emailService = {
  // Send a simple email
  sendEmail: async (to, subject, text, html) => {
    const msg = {
      to,
      from: process.env.FROM_EMAIL, 
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

export default emailService;