import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/config.firebase';
import { useAuth } from './AuthContext';

// Create the context
const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    accentColor: 'purple',
    dashboardLayout: 'default',
    notifications: true
  });
  const { currentUser } = useAuth();

  // Load user preferences from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const loadUserPreferences = async () => {
      try {
        const userRef = doc(db, 'userPreferences', currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          // User preferences exist
          const preferences = docSnap.data();
          setUserPreferences(preferences);
          setDarkMode(preferences.theme === 'dark');
        } else {
          // Create default preferences for new users
          const defaultPreferences = {
            theme: 'light',
            accentColor: 'purple',
            dashboardLayout: 'default',
            notifications: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          
          await setDoc(userRef, defaultPreferences);
          setUserPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };

    loadUserPreferences();
  }, [currentUser]);

  // Update user preference in Firebase
  const updatePreference = async (key, value) => {
    if (!currentUser) return;
    
    try {
      // Update local state
      setUserPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Update in Firebase
      const userRef = doc(db, 'userPreferences', currentUser.uid);
      await updateDoc(userRef, { 
        [key]: value,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Preference updated: ${key} = ${value}`);
    } catch (error) {
      console.error("Error updating user preferences:", error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    updatePreference('theme', newMode ? 'dark' : 'light');
  };

  // Change accent color
  const changeAccentColor = (color) => {
    updatePreference('accentColor', color);
  };

  // Get accent color class
  const getAccentColorClass = (type = 'bg') => {
    const colorMap = {
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700',
      },
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-700',
      },
      green: {
        bg: 'bg-green-600',
        text: 'text-green-600',
        border: 'border-green-600',
        hover: 'hover:bg-green-700',
      },
      red: {
        bg: 'bg-red-600',
        text: 'text-red-600',
        border: 'border-red-600',
        hover: 'hover:bg-red-700',
      },
      orange: {
        bg: 'bg-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-600',
        hover: 'hover:bg-orange-700',
      },
    };
    
    const color = userPreferences.accentColor || 'purple';
    return colorMap[color]?.[type] || colorMap.purple[type];
  };

  // Toggle notifications
  const toggleNotifications = () => {
    const newValue = !userPreferences.notifications;
    updatePreference('notifications', newValue);
  };

  // Change dashboard layout
  const changeDashboardLayout = (layout) => {
    updatePreference('dashboardLayout', layout);
  };

  const value = {
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    setSidebarOpen,
    userPreferences,
    updatePreference,
    changeAccentColor,
    getAccentColorClass,
    toggleNotifications,
    changeDashboardLayout
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook to use preferences
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export default PreferencesContext;