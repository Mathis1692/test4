import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { currentUser, loading, signup } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Check password strength
  useEffect(() => {
    const { password } = formData;
    setPasswordStrength({
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    // Check password strength
    if (!passwordStrength.length || !passwordStrength.hasNumber || !passwordStrength.hasSpecialChar) {
      return setError('Password must be at least 8 characters and include numbers and special characters.');
    }
    
    try {
      setIsSubmitting(true);
      const result = await signup(formData.email, formData.password, {
        displayName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.email.split('@')[0] // Create default username from email
      });
      
      if (result.success) {
        // After successful signup, redirect to email verification page
        navigate('/verify-email');
      } else {
        setError(result.error || 'An error occurred during signup.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show signup form if already logged in and loading is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-purple-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Back button */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 z-50 flex items-center px-4 py-2 bg-white shadow-md rounded-lg text-purple-600 hover:text-purple-800 border border-purple-200 transition-all hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
      
      <div className="max-w-md w-full relative z-10">
        <form 
          className="flex flex-col gap-3 p-6 rounded-2xl relative bg-white text-gray-800 border border-purple-100 shadow-xl"
          onSubmit={handleSubmit}
        >
          {/* Title with animated dot */}
          <p className="text-2xl font-semibold tracking-tight pl-8 text-purple-600 relative flex items-center">
            <span className="absolute left-0 w-4 h-4 bg-purple-500 rounded-full"></span>
            <span className="absolute left-0 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></span>
            Create an account
          </p>
          
          <p className="text-sm text-gray-500 mb-2">
            Join us and start using our service
          </p>
          
          {/* Show error if any */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* First name and last name fields */}
          <div className="flex w-full gap-2">
            <label className="relative w-1/2">
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
                placeholder="First Name"
              />
            </label>
            
            <label className="relative w-1/2">
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
                placeholder="Last Name"
              />
            </label>
          </div>
          
          {/* Email field */}
          <label className="relative">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
              placeholder="Email"
            />
          </label>
          
          {/* Password field */}
          <label className="relative">
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
              placeholder="Password"
            />
          </label>

          {/* Password strength indicator */}
          <div className="flex gap-2 text-xs">
            <div className={passwordStrength.length ? "text-green-600" : "text-gray-400"}>
              8+ characters
            </div>
            <div className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-400"}>
              Numbers
            </div>
            <div className={passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-400"}>
              Special characters
            </div>
          </div>
          
          {/* Confirm password field */}
          <label className="relative">
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
              placeholder="Confirm Password"
            />
          </label>
          
          {/* Submit button */}
          <button 
            type="submit" 
            className="border-none px-4 py-3 rounded-lg text-white text-base transition-all duration-300 bg-purple-600 hover:bg-purple-500/90 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
          
          {/* Sign in link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;