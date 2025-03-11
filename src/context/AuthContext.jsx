import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/config.firebase';

// Create context with default values
const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  error: '',
  signup: async () => ({}),
  login: async () => ({}),
  logout: async () => ({}),
  sendVerificationEmail: async () => ({}),
  resetPassword: async () => ({}),
  updateUserProfile: async () => ({}),
  isAuthenticated: false,
  isVerified: false
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up function using useCallback for stability
  const signup = useCallback(async (email, password, userData) => {
    try {
      setError('');
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name if provided
      if (userData?.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }
      
      // Create default username from email if not provided
      const username = userData?.username || email.split('@')[0];
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        username: username,
        displayName: userData?.displayName || username,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Send email verification with action URL
      const actionCodeSettings = {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      
      return { success: true, user };
    } catch (err) {
      console.error("Signup error:", err);
      
      // Provide user-friendly error messages
      let errorMessage = 'An error occurred during signup.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please provide a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login timestamp
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
      
      return { success: true, user, verified: user.emailVerified };
    } catch (err) {
      console.error("Login error:", err);
      
      // Provide user-friendly error messages
      let errorMessage = 'An error occurred during sign in.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || 'Error logging out');
      return { success: false, error: err.message };
    }
  }, []);

  // Send email verification
  const sendVerificationEmail = useCallback(async () => {
    try {
      if (!currentUser) {
        return { success: false, error: 'No user signed in' };
      }
      
      if (currentUser.emailVerified) {
        return { success: false, error: 'Email is already verified' };
      }
      
      const actionCodeSettings = {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      };
      
      await sendEmailVerification(currentUser, actionCodeSettings);
      return { success: true };
    } catch (err) {
      console.error("Verification email error:", err);
      setError(err.message || 'Error sending verification email');
      return { success: false, error: err.message };
    }
  }, [currentUser]);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
      });
      return { success: true };
    } catch (err) {
      console.error("Password reset error:", err);
      
      // Don't reveal if an email exists for security
      if (err.code === 'auth/user-not-found') {
        return { success: true }; // Still return success
      }
      
      setError(err.message || 'Error resetting password');
      return { success: false, error: err.message };
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (profileData) => {
    try {
      if (!currentUser) {
        return { success: false, error: 'No user signed in' };
      }
      
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...profileData
      }));
      
      return { success: true };
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || 'Error updating profile');
      return { success: false, error: err.message };
    }
  }, [currentUser]);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        setCurrentUser(user);
        
        try {
          // Get user profile from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
            
            // Update email verification status if changed
            if (user.emailVerified && !userDoc.data().emailVerified) {
              await updateDoc(userDocRef, {
                emailVerified: true,
                updatedAt: serverTimestamp()
              });
            }
          } else {
            // Create a basic profile if it doesn't exist
            const basicProfile = {
              uid: user.uid,
              email: user.email,
              username: user.email.split('@')[0],
              displayName: user.displayName || user.email.split('@')[0],
              emailVerified: user.emailVerified,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            await setDoc(userDocRef, basicProfile);
            setUserProfile(basicProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Provide auth context value
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    sendVerificationEmail,
    resetPassword,
    updateUserProfile,
    isAuthenticated: !!currentUser,
    isVerified: !!currentUser?.emailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;