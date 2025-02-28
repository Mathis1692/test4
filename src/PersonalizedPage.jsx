import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';

const PersonalizedPage = () => {
  const { extensionName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageData, setPageData] = useState({
    visits: 0,
    lastVisit: null
  });
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isEntering, setIsEntering] = useState(location.state?.animated || false);
  
  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (!extensionName) {
      navigate('/');
      return;
    }

    const savedData = localStorage.getItem(`page-${extensionName}`);
    const parsedData = savedData ? JSON.parse(savedData) : null;
    
    const newData = {
      visits: parsedData ? parsedData.visits + 1 : 1,
      lastVisit: new Date().toISOString()
    };
    
    setPageData(newData);
    localStorage.setItem(`page-${extensionName}`, JSON.stringify(newData));

    // Handle entrance animation
    if (location.state?.animated) {
      setIsEntering(true);
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setIsEntering(false);
      }, 800);
      
      // Cleanup timeout on component unmount
      return () => clearTimeout(timer);
    }
  }, [extensionName, navigate, location.state]);

  const handleBackClick = (e) => {
    e.preventDefault();
    
    // Add a ref instead of querying DOM directly
    document.querySelector('.container').classList.add('page-exit');
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    console.log(`Sending email to ${email} with personalized URL: ${window.location.origin}/${extensionName}`);
    
    // Direct navigation (without animation)
    navigate(`/calendar/${extensionName}`);
  };

  return (
    <div className={`container max-w-screen-xl mx-auto px-4 py-8 transition-all duration-800 ${isEntering ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Claim @{extensionName} on CIRQLE<br />today
          </h1>
          
          {isEmailSent ? (
            <SuccessView 
              email={email} 
              extensionName={extensionName} 
              handleBackClick={handleBackClick} 
            />
          ) : showLoginForm ? (
            <LoginForm 
              onToggleForm={() => setShowLoginForm(false)} 
            />
          ) : (
            <SignupForm 
              email={email}
              setEmail={setEmail}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              isValidEmail={isValidEmail}
              handleContinue={handleContinue}
              onToggleForm={() => setShowLoginForm(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Extracted component for Success View
const SuccessView = ({ email, extensionName, handleBackClick }) => (
  <div className="text-center">
    <p className="text-xl mb-4">Thank you!</p>
    <p className="mb-6">We've sent an email to <strong>{email}</strong> with your personalized URL.</p>
    <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-6 break-all">
      {window.location.origin}/{extensionName}
    </div>
    <button 
      onClick={handleBackClick} 
      className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
    >
      Back to Home
    </button>
  </div>
);

// Extracted component for Login Form
const LoginForm = ({ onToggleForm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login functionality would be implemented here');
  };

  return (
    <div className="text-center">
      <h2 className="text-xl text-gray-600 mb-8">Log in to your account</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        
        <input 
          type="password" 
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        
        <div className="text-right mb-6">
          <button type="button" className="text-purple-600 text-sm hover:underline">
            Forgot password?
          </button>
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Log in
        </button>
        
        <Divider text="OR" />
        
        <SocialButton type="google" text="Continue with Google" />
        <SocialButton type="apple" text="Continue with Apple" />
        
        <p className="mt-6 text-gray-600">
          Don't have an account? 
          <button 
            type="button"
            onClick={onToggleForm} 
            className="text-purple-600 ml-1 hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

// Extracted component for Signup Form
const SignupForm = ({ 
  email, 
  setEmail, 
  isChecked, 
  setIsChecked, 
  isValidEmail,
  handleContinue,
  onToggleForm 
}) => (
  <div className="text-center">
    <h2 className="text-xl text-gray-600 mb-8">Sign up for free!</h2>
    
    <form onSubmit={handleContinue}>
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      
      <div className="flex items-start mb-6 text-left">
        <div className="flex items-center h-5 mt-1">
          <input
            id="newsletter"
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="w-4 h-4 border border-gray-300 rounded appearance-none checked:bg-purple-600 checked:border-purple-600 focus:outline-none"
          />
          <div className="absolute ml-1 pointer-events-none">
            {isChecked && <CheckIcon className="w-2 h-2 text-white" />}
          </div>
        </div>
        <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
          I agree to receive offers, news and updates from CIRQLE.
        </label>
      </div>
      
      <button 
        type="submit"
        className={`w-full py-3 rounded-full font-medium transition-colors ${
          isValidEmail(email) 
            ? 'bg-black text-white hover:bg-gray-800' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!isValidEmail(email)}
      >
        Continue
      </button>
      
      <p className="text-sm text-gray-500 mt-4 mb-6">
        By clicking Continue, you agree to CIRQLE's 
        <a href="#" className="underline ml-1 hover:text-gray-700">privacy notice</a> and 
        <a href="#" className="underline ml-1 hover:text-gray-700">T&Cs</a>.
      </p>
      
      <Divider text="OR" />
      
      <SocialButton type="google" text="Sign up with Google" />
      <SocialButton type="apple" text="Sign up with Apple" />
      
      <p className="mt-6 text-gray-600">
        Already have an account? 
        <button 
          type="button"
          onClick={onToggleForm} 
          className="text-purple-600 ml-1 hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  </div>
);

// Reusable Divider component
const Divider = ({ text }) => (
  <div className="flex items-center my-6">
    <div className="flex-1 h-px bg-gray-200"></div>
    <span className="px-4 text-sm text-gray-500">{text}</span>
    <div className="flex-1 h-px bg-gray-200"></div>
  </div>
);

// Reusable Social Button component
const SocialButton = ({ type, text }) => (
  <button
    type="button"
    className="w-full py-3 px-4 mb-3 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
  >
    {type === 'google' ? (
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
        <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
        <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
        <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
        <path d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mr-3">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
      </svg>
    )}
    {text}
  </button>
);

export default PersonalizedPage;