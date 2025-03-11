import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from './components/NavBar';
import Background from './components/Background';
import underlineImg from './Assets/purple_underline.png';

const App = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    extension: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle input changes and clear any previous errors
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific error based on field name
    if (name === 'extension') {
      setError('');
    } else if (name === 'email') {
      setEmailError('');
    }
  };

  // Validate email format and domain
  const validateEmail = (email) => {
    // Basic email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    // Extract domain from email
    const domain = email.split('@')[1].toLowerCase();
    
    // Check domain validity with more flexible approach
    // This validates that the domain has at least one dot and proper TLD format
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    
    // Check for suspicious or invalid domains
    const suspiciousTLDs = ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq', 'top'];
    
    if (domainParts.length < 2 || tld.length < 2 || tld.length > 8) {
      setEmailError('Please enter a valid email domain');
      return false;
    }
    
    // Alert for potentially suspicious TLDs but still allow them
    if (suspiciousTLDs.includes(tld)) {
      setEmailError('Consider using a more common email provider.');
      return false;
    }
    
    return true;
  };

  // Real email sending function using your backend SendGrid integration
  const sendConfirmationEmail = async (recipientEmail, username) => {
    try {
      console.log(`Sending confirmation email to ${recipientEmail} for username ${username}`);
      
      // Make API call to your backend
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: recipientEmail,
          extension: username
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
      }
      
      const data = await response.json();
      console.log('Email API response:', data);
      
      return data.success;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  };

  // Form submission logic after validation
  const handleFormSubmission = async () => {
    try {
      // Send confirmation email
      const emailSuccess = await sendConfirmationEmail(formData.email, formData.extension);
      
      if (!emailSuccess) {
        throw new Error("Email could not be sent");
      }
      
      // After successful email sending, navigate to personalized URL
      setTimeout(() => {
        const personalizedUrl = `/${encodeURIComponent(formData.extension)}`;
        navigate(personalizedUrl);
        setIsTransitioning(false);
      }, 600);
    } catch (error) {
      console.error('Error during registration process:', error);
      setError('There was a problem processing your request. Please try again.');
      setIsTransitioning(false);
    }
  };

  // Form submission handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that the extension field isn't empty
    if (!formData.extension.trim()) {
      setError('Please enter your username');
      return;
    }

    // Validate the extension format
    const extensionRegex = /^[a-zA-Z0-9-_]+$/;
    if (!extensionRegex.test(formData.extension)) {
      setError('Extension can only contain letters, numbers, hyphens and underscores');
      return;
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      return;
    }
    
    // Set transitioning state
    setIsTransitioning(true);
    
    // Proceed with form submission
    handleFormSubmission();
  };

  return (
    <>
      {/* Background component outside the main container for full coverage */}
      <Background />
      
      <div className="min-h-screen flex flex-col">
        {/* NavBar component */}
        <NavBar />
        
        <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-12">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side content - Headline and description */}
            <div className="md:w-1/2 space-y-4 md:pr-8">
              {/* Updates badge */}
              <div className="inline-flex items-center rounded-full bg-lime-200 px-3 py-1 text-sm font-medium mb-4">
                <span className="mr-2">Updates</span>
                <span className="text-gray-700">Only 100 experts have access to this beta version</span>
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900">
                Smart links, 
                <br />
                <span className="relative inline-block">
                big impacts.
                </span>
              </h1>
              
              <p className="text-lg text-gray-700 max-w-lg">
                Connect effortlessly, monetize the knowledge, and create meaningful, high-quality interactions that benefit everyone
              </p>
              
              {/* Trusted brands section */}
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-3">Trusted by leading brands:</p>
                <div className="flex flex-wrap items-center gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-16 bg-gray-200 rounded opacity-70"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Form in white box */}
            <div className="md:w-1/2 max-w-md w-full">
              <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                <h2 className="text-3xl font-bold mb-4 text-center">Get started now</h2>
                <p className="text-gray-600 mb-6 text-center">Develop your unique background</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-gray-400">cirqle.me/</span>
                    </div>
                    <input
                      type="text"
                      name="extension"
                      id="extension"
                      value={formData.extension}
                      onChange={handleInputChange}
                      className="w-full pl-24 py-3 text-base border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 focus:outline-none transition-colors bg-gray-100"
                      placeholder="username"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-500 text-sm mt-1">
                      {error}
                    </p>
                  )}
                  
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-5 py-3 text-base border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 focus:outline-none transition-colors bg-gray-100"
                      placeholder="email@gmail.com"
                    />
                  </div>
                  
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">
                      {emailError}
                    </p>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={isTransitioning}
                    className="w-full cursor-pointer group relative bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      <span className="relative inline-block overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                          {isTransitioning ? 'Processing...' : 'Claim your link!'}
                        </span>
                        <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                          {isTransitioning ? 'Please wait...' : 'Get Started'}
                        </span>
                      </span>
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" viewBox="0 0 24 24">
                        <circle fill="currentColor" r={11} cy={12} cx={12} />
                        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="black" d="M7.5 16.5L16.5 7.5M16.5 7.5H10.5M16.5 7.5V13.5" />
                      </svg>
                    </div>
                  </button>
                </form>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  By subscribing, you agree with our <a href="#" className="text-purple-600 underline">Terms of License</a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;