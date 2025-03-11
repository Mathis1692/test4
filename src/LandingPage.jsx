import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from './components/NavBar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [extension, setExtension] = useState('');
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle input changes and clear any previous errors
  const handleInputChange = (e) => {
    setExtension(e.target.value);
    setError('');
  };

  // Validate the username/extension format
  const validateExtension = (extension) => {
    if (!extension.trim()) {
      setError('Please enter your username');
      return false;
    }
    const extensionRegex = /^[a-zA-Z0-9-_]+$/;
    if (!extensionRegex.test(extension)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateExtension(extension)) {
      return;
    }

    setIsTransitioning(true);

    // Navigation directe sans setTimeout pour éviter les problèmes
    navigate('/signup', { state: { extension: extension } });
    setIsTransitioning(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col z-20">
        {/* NavBar component */}
        <NavBar />

        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side content */}
            <div className="md:w-1/2 space-y-4 md:pr-8">
              <div className="inline-flex items-center rounded-full bg-lime-200 px-3 py-1 text-sm font-medium mb-4">
                <span className="mr-2 font-semibold">Updates</span>
                <span className="text-gray-700">Only 100 experts have access to this beta version</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900">
                Smart links, <br />
                <span className="relative inline-block">big impacts.</span>
              </h1>

              <p className="text-lg text-gray-700 max-w-lg">
                Connect effortlessly, monetize knowledge, and create meaningful, high-quality interactions that benefit everyone.
              </p>

              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-3">Trusted by leading brands:</p>
                <div className="flex flex-wrap items-center gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-16 bg-gray-200 rounded opacity-70"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Form */}
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
                      value={extension}
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
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
                    </div>
                  </button>
                </form>

                <p className="mt-4 text-sm text-gray-500 text-center">
                  By subscribing, you agree with our <a href="#" className="text-purple-600 hover:text-purple-800 underline transition-colors">Terms of License</a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;