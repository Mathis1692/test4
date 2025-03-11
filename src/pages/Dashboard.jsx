import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/DashboardNav';
import { Copy, Calendar, Clock, Users, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get username from profile or email
  const username = userProfile?.username || 
                 currentUser?.email?.split('@')[0] || 
                 'user';
  
  // Generate personal link
  const personalLink = `${window.location.origin}/${username}`;
  
  // Handle copy to clipboard using the Clipboard API
  const copyToClipboard = () => {
    navigator.clipboard.writeText(personalLink).then(() => {
      setCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Fetch bookings data - this would use your Firebase service
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // This is a placeholder - replace with actual Firebase fetch
        // const bookingsRef = collection(db, 'bookings');
        // const q = query(bookingsRef, where('hostId', '==', currentUser.uid), orderBy('date', 'asc'));
        // const snapshot = await getDocs(q);
        // const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // setUpcomingBookings(bookingsData);
        
        // Placeholder data
        setUpcomingBookings([
          { 
            id: '1', 
            customerName: 'John Doe', 
            date: new Date(Date.now() + 86400000), 
            time: '10:00', 
            service: 'Consultation' 
          }
        ]);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [currentUser?.uid]);
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardNav />
      
      {/* Main Content */}
      <main className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {userProfile?.displayName || username}!</h1>
          <p className="text-gray-600 mt-1">
            Manage your bookings and share your personal link.
          </p>
        </header>
        
        {/* Personal Link Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Personal Link</h2>
          <div className="flex items-center mb-4">
            <div className="flex-grow bg-gray-100 p-3 rounded-l-lg border border-gray-300 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {personalLink}
            </div>
            <button 
              onClick={copyToClipboard}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-r-lg flex items-center transition-colors"
              aria-label="Copy link to clipboard"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Share this link with your clients so they can book your services.
          </p>
        </div>
        
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
            <Link 
              to="/settings/calendar"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Manage Calendar Settings
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading bookings...</p>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{booking.customerName}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>{formatDate(booking.date)} at {booking.time} • {booking.service}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No upcoming bookings</p>
              <p className="text-sm text-gray-500 mt-1">
                Share your personal link to start receiving bookings.
              </p>
            </div>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Bookings', 'Revenue', 'Clients'].map((stat, index) => (
            <div key={stat} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  {index === 0 ? (
                    <Calendar className="h-6 w-6 text-purple-600" />
                  ) : index === 1 ? (
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  ) : (
                    <Users className="h-6 w-6 text-purple-600" />
                  )}
                </div>
                <h3 className="ml-3 text-lg font-medium">{stat}</h3>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{index === 0 ? '0' : index === 1 ? '$0' : '0'}</p>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;