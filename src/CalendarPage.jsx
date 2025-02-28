import React, { useState } from 'react';
import { Clock, Video, ChevronLeft, ChevronRight, Globe, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Customer profile configuration
const CUSTOMER_DEFAULTS = {
  defaultTimeZone: "Europe/Paris",
};

// Service options
const SERVICE_OPTIONS = [
  {
    id: "quick-call",
    name: "Quick Call",
    duration: 15,
    durationMinutes: 15,
    description: "Suited for people seeking strategic advice",
    icon: "clock"
  },
  {
    id: "consultation",
    name: "Consultation",
    duration: 30,
    durationMinutes: 30,
    description: "Ideal to explore any useful subject",
    icon: "video",
    default: true
  },
  {
    id: "mentoring",
    name: "5 Mentoring Sessions",
    duration: "5 sessions x 30 min",
    durationMinutes: 30,
    description: "Unique opportunity to learn from a mentor experience, to take your objectives to the skies!",
    icon: "calendar"
  }
];

const CalendarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Company and host info
  const companyName = "CIRQLE";
  const meetingType = "Zoom";
  
  const { extensionName } = location.state || {
    extensionName: companyName.toLowerCase().replace(/\s+/g, '-')
  };
  
  // State management
  const [selectedService, setSelectedService] = useState(
    SERVICE_OPTIONS.find(service => service.default) || SERVICE_OPTIONS[0]
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Service, 2: Date, 3: Time
  const [timeZone, setTimeZone] = useState(CUSTOMER_DEFAULTS.defaultTimeZone);

  // Format month and year
  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Format month bold
  const formatMonthBold = (date) => {
    const monthYear = formatMonth(date).split(' ');
    return (
      <span>
        <span className="font-bold">{monthYear[0]}</span> {monthYear[1]}
      </span>
    );
  };

  // Format full date
  const formatFullDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1 && date2 &&
           date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Function to get days for current month view - with Monday start
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Adjust for Monday start (0 becomes Monday, 1 becomes Tuesday, ..., 6 becomes Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add days from previous month to fill the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, 1 - (firstDayOfWeek - i));
      days.push({
        date: prevMonthDay,
        dayOfMonth: prevMonthDay.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(prevMonthDay, new Date()),
        isSelected: selectedDate && isSameDay(prevMonthDay, selectedDate)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: isSameDay(currentDate, new Date()),
        isSelected: selectedDate && isSameDay(currentDate, selectedDate)
      });
    }
    
    // Get the day of the week for the last day
    let lastDayOfWeek = lastDay.getDay();
    // Adjust for Monday start
    lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
    
    // Add days from next month to fill up to exactly 6 rows (42 cells)
    const totalDaysSoFar = days.length;
    const daysToAdd = 42 - totalDaysSoFar; // Force 6 rows exactly (6 * 7 = 42)
    
    for (let i = 1; i <= daysToAdd; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({
        date: nextMonthDay,
        dayOfMonth: nextMonthDay.getDate(),
        isCurrentMonth: false,
        isToday: isSameDay(nextMonthDay, new Date()),
        isSelected: selectedDate && isSameDay(nextMonthDay, selectedDate)
      });
    }
    
    return days;
  };

  // Navigate between months
  const changeMonth = (direction) => {
    setIsLoading(true);
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
    
    // Simulating network request for available slots
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setIsLoading(true);
    
    // Then show time slots after a brief delay (simulating API call)
    setTimeout(() => {
      setShowTimeSlots(true);
      setIsLoading(false);
      setCurrentStep(3);
    }, 400);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Available time slots - could be dynamic based on selected service
  const timeSlots = ["10:00", "11:00", "14:00", "15:00", "17:00", "17:30"];

  // Weekday headers - Monday first
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  // Get the grid data
  const calendarDays = getDaysInMonth(currentMonth);

  // Split the calendar days into exactly 6 weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Handle confirmation - navigate to BookingForm.jsx
  const handleConfirm = () => {
    if (!selectedTime) return;
    
    navigate(`/booking-form/${extensionName || 'default'}`, { 
      state: {
        service: selectedService.name,
        duration: selectedService.durationMinutes || selectedService.duration,
        durationDisplay: selectedService.duration,
        extensionName,
        date: selectedDate.toISOString(),
        time: selectedTime,
        timeZone: timeZone
      }
    });
  };

  // Toggle time zone dropdown
  const toggleTimeZoneDropdown = () => {
    setShowTimeZoneDropdown(!showTimeZoneDropdown);
  };

  // Time zones array
  const timeZones = [
    "Europe/Paris",
    "Europe/London",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago"
  ];

  // Time zone display names
  const timeZoneDisplayNames = {
    "Europe/Paris": "Paris (CET)",
    "Europe/London": "London (GMT/BST)",
    "America/New_York": "New York (EST/EDT)",
    "America/Los_Angeles": "Los Angeles (PST/PDT)",
    "America/Chicago": "Chicago (CST/CDT)"
  };

  // Select time zone
  const selectTimeZone = (tz) => {
    setTimeZone(tz);
    setShowTimeZoneDropdown(false);
  };

  // Get the icon component based on service icon name
  const getServiceIcon = (iconName) => {
    switch(iconName) {
      case 'clock':
        return <Clock size={20} className="text-blue-500" />;
      case 'video':
        return <Video size={20} className="text-blue-500" />;
      case 'calendar':
        return <CalendarIcon size={20} className="text-blue-500" />;
      default:
        return <Clock size={20} className="text-blue-500" />;
    }
  };

  // Render progress steps
  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-center mb-4">
        <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${currentStep >= 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Service</span>
        </div>
        <div className={`w-10 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${currentStep >= 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Date</span>
        </div>
        <div className={`w-10 h-0.5 mx-2 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${currentStep >= 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Time</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Share your booking page</h1>
        
        {/* Time Zone Selector - Moved to top right */}
        <div className="relative">
          <button 
            className="flex items-center justify-between border border-gray-300 rounded py-1.5 px-3
              text-gray-700 text-sm hover:border-gray-400 transition-colors 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleTimeZoneDropdown}
          >
            <div className="flex items-center">
              <Globe size={16} className="mr-1.5 text-gray-500" />
              <span>{timeZoneDisplayNames[timeZone] || timeZone}</span>
            </div>
            <ChevronRight size={14} className={`ml-2
              transform ${showTimeZoneDropdown ? 'rotate-180' : 'rotate-90'} 
              text-gray-500 transition-transform duration-200
            `} />
          </button>
          
          {/* Time zone dropdown */}
          {showTimeZoneDropdown && (
            <div className="absolute z-10 right-0 mt-1 w-48 bg-white shadow-lg rounded-md p-1.5 border border-gray-200">
              {timeZones.map(tz => (
                <button 
                  key={tz}
                  className={`block w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 
                    ${timeZone === tz ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => selectTimeZone(tz)}
                >
                  {timeZoneDisplayNames[tz] || tz}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="px-6 pt-4 pb-2">
        {renderProgressSteps()}
      </div>
      
      <div className="flex p-3">
        {/* Left Column - Service Options */}
        <div className="w-1/4 p-3 border-r border-gray-100">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 text-white p-1.5 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="text-lg text-gray-700 font-medium">{companyName}</span>
            </div>
            
            <div className="mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-3">
                {/* Profile Image */}
                <div className="w-full h-full bg-gray-300"></div>
              </div>
              <h3 className="text-base text-gray-600">{extensionName}</h3>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-gray-800 mb-3">Select a Service</h2>
          
          {/* Service Options */}
          <div className="space-y-3 overflow-y-auto max-h-[400px]">
            {SERVICE_OPTIONS.map((service) => (
              <button
                key={service.id}
                className={`
                  w-full p-3 rounded-lg border transition-all duration-200 text-left
                  ${selectedService.id === service.id 
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{service.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Clock size={14} className="mr-1" />
                      <span>{typeof service.duration === 'string' ? service.duration : `${service.duration} min`}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Middle Column - Calendar - Increased width */}
        <div className="w-1/2 p-3 border-r border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Select a Date</h2>
          
          {/* Selected Service Summary */}
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="mr-3">
                {getServiceIcon(selectedService.icon)}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{selectedService.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Clock size={14} className="mr-1" />
                  <span>{typeof selectedService.duration === 'string' ? selectedService.duration : `${selectedService.duration} min`}</span>
                  <span className="mx-2">•</span>
                  <Video size={14} className="mr-1" />
                  <span>{meetingType}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-base font-medium text-gray-800">
              {formatMonthBold(currentMonth)}
            </span>
            <button 
              onClick={() => changeMonth(1)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="mb-3">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-1">
              {weekdays.map(day => (
                <div key={day} className="text-center text-xs text-gray-500 py-1 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days - Exactly 6 rows but with adjusted height */}
            <div className={`space-y-0.5 ${isLoading ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                        h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm
                        ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-800'}
                        ${day.isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                        ${day.isToday && !day.isSelected ? 'border border-blue-500' : ''}
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                        transition-colors duration-200
                      `}
                      onClick={() => handleDateSelect(day.date)}
                      disabled={!day.isCurrentMonth || isLoading}
                      aria-label={`${day.date.toLocaleDateString()}, ${day.isSelected ? 'selected' : ''}`}
                      aria-current={day.isToday ? 'date' : undefined}
                      aria-selected={day.isSelected}
                    >
                      {day.dayOfMonth}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Time Slots - Reduced width */}
        <div className="w-1/4 p-3">
          {selectedDate ? (
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                {formatFullDate(selectedDate)}
              </h2>
              
              {/* Time Slots in a scrollable container */}
              <div className="overflow-y-auto mb-2 flex-grow max-h-[200px]">
                <div className={`grid grid-cols-1 gap-2 ${isLoading ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}>
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      className={`
                        py-2 px-3 border rounded-lg text-center transition-all duration-200
                        ${selectedTime === time 
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                          : 'border-gray-300 text-blue-500 hover:border-blue-300 hover:bg-blue-50'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                      onClick={() => handleTimeSelect(time)}
                      disabled={isLoading}
                      aria-selected={selectedTime === time}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected Time Summary - Compact Layout */}
              {selectedTime && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  <h3 className="font-medium text-gray-800 mb-1">Your selected appointment:</h3>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <p><span className="font-medium">Service:</span> {selectedService.name}</p>
                    <p><span className="font-medium">Duration:</span> {typeof selectedService.duration === 'string' ? selectedService.duration : `${selectedService.duration} min`}</p>
                    <p><span className="font-medium">Date:</span> {formatFullDate(selectedDate)}</p>
                    <p><span className="font-medium">Time:</span> {selectedTime}</p>
                    <p><span className="font-medium">Zone:</span> {timeZoneDisplayNames[timeZone] || timeZone}</p>
                  </div>
                </div>
              )}
              
              {/* Confirm Button - Always visible in the flow */}
              <div className="mt-auto">
                <button
                  className={`
                    py-3 px-4 rounded-lg text-center font-medium w-full transition-all duration-200
                    ${selectedTime 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    sticky bottom-0
                  `}
                  onClick={handleConfirm}
                  disabled={!selectedTime}
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
              <div className="p-4 rounded-full bg-gray-50 mb-3">
                <CalendarIcon size={28} className="text-gray-300" />
              </div>
              <p className="text-sm text-center max-w-xs">
                Select a date from the calendar to view available times
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;