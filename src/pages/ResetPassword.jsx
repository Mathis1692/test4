import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setStatus(null);
    setMessage('');
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setStatus('success');
        setMessage('If an account exists with this email, you will receive a password reset link shortly. Please check your inbox and spam folder.');
        setEmail(''); // Clear the form
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="flex flex-col gap-3 p-6 rounded-2xl relative bg-white text-gray-800 border border-purple-100 shadow-xl">
          {/* Back link */}
          <Link to="/login" className="flex items-center text-purple-600 mb-2 hover:text-purple-700">
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Sign In</span>
          </Link>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you a link to reset your password
          </p>
          
          {/* Status message */}
          {status && (
            <div className={`mb-4 p-4 rounded-lg ${
              status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex items-start">
                {status === 'success' ? (
                  <CheckCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                )}
                <span>{message}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <label className="relative block mb-6">
              <div className="flex items-center absolute left-3 top-3.5 pointer-events-none text-gray-500">
                <Mail size={16} className="mr-2" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 text-gray-800 w-full py-3 pl-10 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400"
                placeholder="Email Address"
                required
                autoFocus
              />
            </label>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-500 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending Email...' : 'Send Reset Link'}
            </button>
          </form>
          
          {/* Create account link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;