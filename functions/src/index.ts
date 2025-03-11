// functions/src/index.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineString } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize Firebase admin
admin.initializeApp();

// Define configuration parameters
const gmailEmail = defineString('GMAIL_EMAIL');
const gmailPassword = defineString('GMAIL_PASSWORD');

// Create email function
export const sendAppointmentEmail = onDocumentCreated('appointments/{appointmentId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return null;
  }

  const appointmentData = snapshot.data();
  const appointmentId = event.params.appointmentId;
  
  // Check if email configuration exists
  if (!gmailEmail.value() || !gmailPassword.value()) {
    console.error('Missing email configuration');
    return null;
  }
  
  try {
    // Create nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail.value(),
        pass: gmailPassword.value()
      }
    });
    
    // Format date - handle potential undefined date
    let formattedDate = "Not specified";
    if (appointmentData.date) {
      const appointmentDate = appointmentData.date.toDate();
      formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // Send email to client
    await transporter.sendMail({
      from: `"Booking System" <${gmailEmail.value()}>`,
      to: appointmentData.clientEmail || appointmentData.email,
      subject: `Booking Confirmation - ${appointmentData.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your booking has been confirmed!</h2>
          <p>Hello ${appointmentData.clientName || appointmentData.name},</p>
          <div style="background-color: #f5f7fb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Service:</strong> ${appointmentData.service}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${appointmentData.time}</p>
          </div>
          <p>Thank you for your booking!</p>
        </div>
      `
    });
    
    console.log(`Email sent to ${appointmentData.clientEmail || appointmentData.email}`);
    
    // Update the appointment record
    await admin.firestore()
      .collection('appointments')
      .doc(appointmentId)
      .update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
    return null;
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
});