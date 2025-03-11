import express from 'express';
import sgMail from '@sendgrid/mail';

const router = express.Router();

// Don't set the API key immediately - we'll do this later
// when we actually have access to the environment variables

// Route to send welcome email
router.post('/welcome', async (req, res) => {
  try {
    // Set API key right before using it to ensure environment variables are loaded
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured - API key missing' 
      });
    }
    
    const { email, extension } = req.body;
    
    if (!email || !extension) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Create email content
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL || 'your-verified@email.com',
      subject: 'Welcome to Cirqle.me!',
      text: `Hi ${extension}, welcome to Cirqle! Your personal link is ready: cirqle.me/${extension}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6d28d9;">Welcome to Cirqle!</h1>
          <p>Hi ${extension},</p>
          <p>Thank you for joining Cirqle. Your personal link has been created:</p>
          <p><a href="https://cirqle.me/${extension}" style="color: #6d28d9; font-weight: bold;">cirqle.me/${extension}</a></p>
        </div>
      `
    };
    
    // Send email
    const response = await sgMail.send(msg);
    console.log('Email sent successfully');
    
    res.status(200).json({ success: true, message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    
    if (error.response) {
      console.error(error.response.body);
    }
    
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Contact route
router.post('/contact', async (req, res) => {
  try {
    // Set API key right before using it to ensure environment variables are loaded
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured - API key missing' 
      });
    }
    
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const subject = `New Contact Form Submission from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const html = `<p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Message:</strong> ${message}</p>`;
    
    // Send email
    const msg = {
      to: process.env.ADMIN_EMAIL || 'your-admin@email.com',
      from: process.env.FROM_EMAIL || 'your-verified@email.com',
      subject,
      text,
      html
    };
    
    await sgMail.send(msg);
    
    console.log('Contact email sent successfully');
    
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

export default router;