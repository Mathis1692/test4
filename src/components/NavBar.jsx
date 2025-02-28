import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 left-0 w-full z-50 pt-5 pb-2 flex justify-center">
      <nav 
        className={`
          w-[750px] h-[68px] px-8 rounded-full transition-all duration-300
          ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white shadow-lg'}
        `}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-10">
            <Link to="/" className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              CIRQLE
            </Link>
            
            <div className="hidden md:flex items-center space-x-12">
              <NavLink to="/">Features</NavLink>
              <NavLink to="/features">Integration</NavLink>
              <NavLink to="/pricing">Income booster</NavLink>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="bg-gray-100 text-black font-medium px-4 py-2 text-sm rounded-full transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-black text-white font-medium px-4 py-2 text-sm rounded-full hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[calc(100%-2rem)] bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:hidden">
            <div className="flex flex-col space-y-3">
              <MobileNavLink to="/">Features</MobileNavLink>
              <MobileNavLink to="/features">Integration</MobileNavLink>
              <MobileNavLink to="/pricing">Income booster</MobileNavLink>
              <div className="h-px bg-gray-100 my-3"></div>
              <MobileNavLink to="/login">Log In</MobileNavLink>
              <Link 
                to="/signup" 
                className="bg-black text-white text-center w-full px-4 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative text-sm text-gray-700 font-medium hover:text-purple-600 transition-colors group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-300" />
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors"
  >
    {children}
  </Link>
);

export default NavBar;