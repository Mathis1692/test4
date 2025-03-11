import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/config.firebase';
import { ChevronLeft, Plus, X, Clock, Save, Globe, Calendar } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarSettings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Calendar settings state
  const [settings, setSettings] = useState({
    pageTitle: '',
    welcomeMessage: '',
    services: [],
    availability: {
      weekdays: {
        monday: { enabled: true, slots: [] },
        tuesday: { enabled: true, slots: [] },
        wednesday: { enabled: true, slots: [] },
        thursday: { enabled: true, slots: [] },
        friday: { enabled: true, slots: [] },
        saturday: { enabled: false, slots: [] },
        sunday: { enabled: false, slots: [] }
      },
      timezone: 'Europe/Paris'
    }
  });
  
  // Fetch calendar settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().calendarSettings) {
          setSettings(userDoc.data().calendarSettings);
        } else {
          // Initialize with default settings
          const username = currentUser?.displayName?.split(' ')[0] || 
                         currentUser?.email?.split('@')[0] || 
                         'user';
                         
          const defaultSettings = {
            pageTitle: `Book with ${username}`,
            welcomeMessage: 'I look forward to speaking with you!',
            services: [
              { id: '1', name: 'Consultation', duration: 30, description: 'Initial consultation', price: 50 }
            ],
            availability: {
              weekdays: {
                monday: { enabled: true, slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00'] },
                tuesday: { enabled: true, slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00'] },
                wednesday: { enabled: true, slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00'] },
                thursday: { enabled: true, slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00'] },
                friday: { enabled: true, slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00'] },
                saturday: { enabled: false, slots: [] },
                sunday: { enabled: false, slots: [] }
              },
              timezone: 'Europe/Paris'
            }
          };
          
          setSettings(defaultSettings);
          await setDoc(userDocRef, { 
            calendarSettings: defaultSettings,
            username: username
          }, { merge: true });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [currentUser]);
  
  // Save settings to Firestore
  const saveSettings = async () => {
    if (!currentUser) return;
    
    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { 
        calendarSettings: settings 
      }, { merge: true });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Service methods
  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      name: 'New Service',
      duration: 30,
      description: 'Service description',
      price: 0
    };
    
    setSettings({
      ...settings,
      services: [...settings.services, newService]
    });
  };
  
  const updateService = (id, field, value) => {
    setSettings({
      ...settings,
      services: settings.services.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    });
  };
  
  const deleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setSettings({
        ...settings,
        services: settings.services.filter(service => service.id !== id)
      });
    }
  };
  
  // Availability methods
  const toggleDayEnabled = (day) => {
    setSettings({
      ...settings,
      availability: {
        ...settings.availability,
        weekdays: {
          ...settings.availability.weekdays,
          [day]: {
            ...settings.availability.weekdays[day],
            enabled: !settings.availability.weekdays[day].enabled
          }
        }
      }
    });
  };
  
  const addTimeSlot = (day) => {
    // Default time slots to choose from
    const defaultSlots = [
      '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];
    
    // Find first available slot
    const currentSlots = settings.availability.weekdays[day].slots;
    const availableSlot = defaultSlots.find(slot => !currentSlots.includes(slot)) || '9:00';
    
    setSettings({
      ...settings,
      availability: {
        ...settings.availability,
        weekdays: {
          ...settings.availability.weekdays,
          [day]: {
            ...settings.availability.weekdays[day],
            slots: [...currentSlots, availableSlot].sort()
          }
        }
      }
    });
  };
  
  const removeTimeSlot = (day, slot) => {
    setSettings({
      ...settings,
      availability: {
        ...settings.availability,
        weekdays: {
          ...settings.availability.weekdays,
          [day]: {
            ...settings.availability.weekdays[day],
            slots: settings.availability.weekdays[day].slots.filter(s => s !== slot)
          }
        }
      }
    });
  };
  
  const updateTimeSlot = (day, oldSlot, newSlot) => {
    // Don't allow duplicates
    if (settings.availability.weekdays[day].slots.includes(newSlot)) {
      return;
    }
    
    setSettings({
      ...settings,
      availability: {
        ...settings.availability,
        weekdays: {
          ...settings.availability.weekdays,
          [day]: {
            ...settings.availability.weekdays[day],
            slots: settings.availability.weekdays[day].slots
              .map(s => s === oldSlot ? newSlot : s)
              .sort()
          }
        }
      }
    });
  };
  
  const setTimezone = (timezone) => {
    setSettings({
      ...settings,
      availability: {
        ...settings.availability,
        timezone
      }
    });
  };
  
  // Page settings methods
  const updatePageSetting = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };
  
  // Time zones
  const timeZones = [
    'Europe/Paris',
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Asia/Tokyo',
    'Australia/Sydney',
    'UTC'
  ];
  
  // Day display names
  const dayDisplayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };
  
  // Convert availability settings to FullCalendar business hours format
  const getBusinessHours = () => {
    const businessHours = [];
    
    Object.entries(settings.availability.weekdays).forEach(([day, daySettings]) => {
      if (daySettings.enabled) {
        // Map day names to FullCalendar day indices (0=Sunday, 1=Monday, etc.)
        const dayMap = {
          monday: 1, tuesday: 2, wednesday: 3, 
          thursday: 4, friday: 5, saturday: 6, sunday: 0
        };
        
        // Add the day to business hours
        businessHours.push({
          daysOfWeek: [dayMap[day]],
          startTime: daySettings.slots[0] || '09:00',
          endTime: daySettings.slots[daySettings.slots.length - 1] || '17:00'
        });
      }
    });
    
    return businessHours;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
              <h1 className="ml-4 text-xl font-semibold text-purple-600">Calendar Settings</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className={`
                  flex items-center px-4 py-2 rounded-md
                  ${isSaving ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                  text-white transition-colors
                `}
              >
                {isSaving ? (
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
                  <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                  Saved successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'services'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'availability'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('availability')}
          >
            Availability
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'page'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('page')}
          >
            Page Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Your Services</h2>
                <button
                  onClick={addService}
                  className="flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Service
                </button>
              </div>

              {settings.services.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">You haven't created any services yet.</p>
                  <button
                    onClick={addService}
                    className="mt-3 text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Create your first service
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {settings.services.map(service => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Name
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={e => updateService(service.id, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <select
                            value={service.duration}
                            onChange={e => updateService(service.id, 'duration', parseInt(e.target.value, 10))}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                            <option value={120}>120 minutes</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
                            <input
                              type="number"
                              min="0"
                              value={service.price}
                              onChange={e => updateService(service.id, 'price', parseInt(e.target.value, 10) || 0)}
                              className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={service.description}
                          onChange={e => updateService(service.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteService(service.id)}
                          className="flex items-center text-red-600 hover:text-red-800"
                        >
                          <X size={16} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Availability</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe size={16} className="text-gray-400" />
                    </div>
                    <select
                      value={settings.availability.timezone}
                      onChange={e => setTimezone(e.target.value)}
                      className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {timeZones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Calendar View */}
                <div className="mb-8">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Weekly Schedule Overview</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-2">
                    <FullCalendar
                      plugins={[timeGridPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={false}
                      allDaySlot={false}
                      slotDuration="01:00:00"
                      slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }}
                      businessHours={getBusinessHours()}
                      height={400}
                      weekends={true}
                      firstDay={1} // Monday start
                    />
                  </div>
                </div>
                
                {/* Daily Availability Settings */}
                <div className="space-y-4">
                  {Object.entries(settings.availability.weekdays).map(([day, daySettings]) => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`enable-${day}`}
                            checked={daySettings.enabled}
                            onChange={() => toggleDayEnabled(day)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`enable-${day}`} className="ml-2 font-medium text-gray-700">
                            {dayDisplayNames[day]}
                          </label>
                        </div>
                        
                        {daySettings.enabled && (
                          <button
                            onClick={() => addTimeSlot(day)}
                            className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                          >
                            <Plus size={16} className="mr-1" />
                            Add Time Slot
                          </button>
                        )}
                      </div>
                      
                      {daySettings.enabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {daySettings.slots.length > 0 ? (
                            daySettings.slots.map((slot, index) => (
                              <div key={`${day}-${slot}`} className="flex items-center border border-gray-200 rounded-lg p-2">
                                <Clock size={14} className="text-gray-400 mr-2" />
                                <select
                                  value={slot}
                                  onChange={e => updateTimeSlot(day, slot, e.target.value)}
                                  className="flex-grow text-sm p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                                >
                                  {Array.from({ length: 24 * 2 }).map((_, i) => {
                                    const hour = Math.floor(i / 2);
                                    const minute = i % 2 === 0 ? '00' : '30';
                                    const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
                                    return (
                                      <option key={timeValue} value={timeValue}>
                                        {timeValue}
                                      </option>
                                    );
                                  })}
                                </select>
                                <button
                                  onClick={() => removeTimeSlot(day, slot)}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-sm text-gray-500 italic">
                              No time slots available. Click "Add Time Slot" to add availability.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Page Settings Tab */}
          {activeTab === 'page' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Page Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={settings.pageTitle}
                    onChange={e => updatePageSetting('pageTitle', e.target.value)}
                    placeholder="e.g., Book a Meeting with John"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Welcome Message
                  </label>
                  <textarea
                    value={settings.welcomeMessage}
                    onChange={e => updatePageSetting('welcomeMessage', e.target.value)}
                    placeholder="e.g., Thanks for scheduling a meeting with me. I look forward to speaking with you!"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                {/* Preview */}
                <div className="mt-8 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xl font-bold text-center text-gray-800">
                      {settings.pageTitle || "Book a Meeting"}
                    </h4>
                    <p className="mt-2 text-center text-gray-600">
                      {settings.welcomeMessage || "I look forward to meeting with you!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSettings;