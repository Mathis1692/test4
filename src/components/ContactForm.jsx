import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, error: null });

    try {
      const response = await axios.post('/api/email/contact', formData);
      
      if (response.data.success) {
        setStatus({
          submitting: false,
          success: 'Your message has been sent! We will get back to you soon.',
          error: null
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: null,
        error: error.response?.data?.message || error.message || 'An error occurred. Please try again later.'
      });
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      
      {status.success && (
        <div className="alert alert-success">{status.success}</div>
      )}
      
      {status.error && (
        <div className="alert alert-danger">{status.error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-control"
            rows="5"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status.submitting}
        >
          {status.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;