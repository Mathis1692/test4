import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';

const EmailVerification = () => {
  const { currentUser, sendVerificationEmail, logout, updateUserProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verificationChecks, setVerificationChecks] = useState(0);
  const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
  const navigate = useNavigate();

  // Check if email is verified - using callback to prevent linting issues with dependencies
  const checkIfVerified = useCallback(async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      // Force refresh the user to get the latest emailVerified status
      await currentUser.reload();
      
      // Check if email is now verified
      if (currentUser.emailVerified) {
        // Update the user's profile in Firestore to mark as verified
        await updateUserProfile({
          emailVerified: true,
          accountStatus: 'active'
        });
        
        setStatus('success');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // Increment verification check counter
        setVerificationChecks(prev => prev + 1);
        
        // After 10 unsuccessful checks, show a more prominent message
        if (verificationChecks >= 10) {
          setMessage('Make sure to check your spam folder and click the verification link in the email.');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      setStatus('error');
      setMessage('Error checking verification status. Please try reloading the page.');
    }
  }, [currentUser, navigate, updateUserProfile, verificationChecks]);

  // Initial check and setup interval
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Initial check
    checkIfVerified();
    
    // Set up refresh interval to check for verification
    const checkInterval = setInterval(checkIfVerified, 5000); // Check every 5 seconds
    
    return () => clearInterval(checkInterval);
  }, [currentUser, navigate, checkIfVerified]);

  // Resend email handler
  const handleResendEmail = async () => {
    if (timeLeft > 0) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const result = await sendVerificationEmail();
      if (result.success) {
        setStatus('pending');
        setMessage('Verification email sent! Please check your inbox and spam folder.');
        setTimeLeft(60); // Cooldown of 60 seconds
        
        // Reset verification checks counter
        setVerificationChecks(0);
      } else {
        setStatus('error');
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Render different UI based on verification status
  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been verified. Redirecting you to your dashboard...
          </p>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-1">
          We've sent a verification email to:
        </p>
        <p className="text-lg font-semibold mb-6 break-all">
          {currentUser?.email}
        </p>
        
        {/* Status message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {status === 'error' ? (
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </div>
        )}
        
        <div className="space-y-2 mb-6">
          <p className="text-gray-600">
            Please click on the verification link in the email to verify your account.
          </p>
          <p className="text-gray-600">
            If you don't see the email, check your spam folder.
          </p>
          {verificationChecks > 5 && (
            <p className="text-amber-600 font-medium">
              Still waiting? Try clicking the "Resend Email" button below.
            </p>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading || timeLeft > 0}
            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (loading || timeLeft > 0) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {timeLeft > 0 
              ? `Resend Email (${timeLeft}s)` 
              : loading 
              ? "Sending..." 
              : "Resend Email"}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;