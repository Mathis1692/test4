import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Video, Globe, ChevronDown, CheckCircle, X } from 'lucide-react';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/book');
    }
  }, [bookingDetails, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalBookingData = {
      ...formData,
      service: bookingDetails?.selectedService,
      date: bookingDetails?.selectedDate,
      time: bookingDetails?.selectedTime,
      extensionName: bookingDetails?.extensionName
    };
    
    console.log('Final booking data:', finalBookingData);
    // Show success modal instead of navigating
    setShowSuccessModal(true);
  };

  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Left Section */}
        <div className="w-80 p-8 border-r border-gray-200">
          <img 
            src="/api/placeholder/48/48" 
            alt="Profile" 
            className="w-12 h-12 rounded-full mb-4"
          />
          <div className="text-base font-medium text-gray-500 mb-1">@</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            {bookingDetails?.selectedService || 'Demo call'}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet cons ectetur. Turpis gravida eget felis senectus eleifend.
          </p>
          
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock size={20} className="text-gray-400" />
              <span>{bookingDetails?.selectedTime || '15m'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Video size={20} className="text-gray-400" />
              <span>Zoom</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Globe size={20} className="text-gray-400" />
              <span>Europe/Paris</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Booking Summary</h3>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700">Date:</span> {formatDate(bookingDetails?.selectedDate)}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700">Time:</span> {bookingDetails?.selectedTime}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Service:</span> {bookingDetails?.selectedService}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 border border-gray-200 text-gray-700">
              15m
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100">
              30m
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100">
              Mentoring
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex-1 p-8 bg-white">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Mathis Delafont"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="email@gmail.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any information useful for the meeting..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y min-h-[100px]"
            />
          </div>

          <p className="text-sm text-gray-500 mb-6">
            By proceeding you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>

          <div className="flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={handleBack}
              className="px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <CheckCircle size={60} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600">
                Your appointment has been successfully scheduled.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {formData.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Service:</span> {bookingDetails?.selectedService}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {formatDate(bookingDetails?.selectedDate)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span> {bookingDetails?.selectedTime}
                </p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 mb-6">
              A confirmation email has been sent to <span className="font-medium">{formData.email}</span>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;