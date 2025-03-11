import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, User, Mail, Save, Check } from 'lucide-react';

const ProfileSettings = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    username: '',
    bio: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        displayName: userProfile.displayName || '',
        username: userProfile.username || '',
        bio: userProfile.bio || ''
      });
    }
  }, [userProfile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user makes changes
    if (error) setError('');
    if (saveSuccess) setSaveSuccess(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9-_]+$/;
      if (!usernameRegex.test(formData.username)) {
        setError('Username can only contain letters, numbers, hyphens, and underscores');
        setIsSubmitting(false);
        return;
      }
      
      // Update profile data
      const result = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName || `${formData.firstName} ${formData.lastName}`.trim(),
        username: formData.username,
        bio: formData.bio
      });
      
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                <ChevronLeft size={20} />
                <span className="ml-1">Back</span>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-purple-600">Profile Settings</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  flex items-center px-4 py-2 rounded-md
                  ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                  text-white transition-colors
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              
              {saveSuccess && (
                <div className="ml-4 text-green-600 flex items-center">
                  <Check className="h-5 w-5 mr-1" />
                  Saved
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <p className="text-sm text-gray-500 mb-5">
                Update your personal information and how others will see you on the platform.
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-5 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Public Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">This is how your name will appear to others.</p>
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      cirqle.me/
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    This will be your unique link. Only letters, numbers, hyphens, and underscores allowed.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Tell others a bit about yourself..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Brief description for your profile. This will be visible on your calendar page.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-5 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your Personal Link</h3>
              
              <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <a 
                    href={`${window.location.origin}/${formData.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    {window.location.origin}/{formData.username}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${formData.username}`);
                    alert('Link copied to clipboard!');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Copy Link
                </button>
              </div>
            </div>
            
            <div className="pt-5 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{currentUser?.email}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Your email address is verified and cannot be changed. This email is used for account recovery and notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;