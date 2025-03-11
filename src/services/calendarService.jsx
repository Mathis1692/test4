// src/services/calendarService.js
import { db } from '../config/config.firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';

// Collection names
const APPOINTMENTS_COLLECTION = 'appointments';
const AVAILABILITY_COLLECTION = 'availability';
const USERS_COLLECTION = 'users';

// Service to handle calendar operations
const calendarService = {
  // Save a new appointment
  saveAppointment: async (appointmentData) => {
    try {
      const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
      
      // Convert date to Firestore timestamp if it's a Date object
      const processedData = {
        ...appointmentData,
        date: appointmentData.date instanceof Date 
          ? Timestamp.fromDate(appointmentData.date) 
          : appointmentData.date,
        createdAt: Timestamp.now(),
      };
      
      // Add a new document with a generated id
      const docRef = await addDoc(appointmentsRef, processedData);
      
      console.log("Appointment saved with ID: ", docRef.id);
      
      // Email notifications are handled by Firestore triggers (Cloud Functions)
      // You can also manually trigger an email sending function here if you prefer
      
      return { id: docRef.id, ...appointmentData };
    } catch (error) {
      console.error("Error saving appointment: ", error);
      throw error;
    }
  },
  
  // Get appointments for a specific date
  getAppointmentsByDate: async (date) => {
    try {
      // Convert date to start and end of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);
      
      // Query appointments for the date
      const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
      const q = query(
        appointmentsRef, 
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
      );
      
      const querySnapshot = await getDocs(q);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return appointments;
    } catch (error) {
      console.error("Error getting appointments: ", error);
      throw error;
    }
  },
  
  // Get available time slots for a specific date
  getAvailability: async (hostId, date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const availabilityRef = doc(db, AVAILABILITY_COLLECTION, `${hostId}_${dateStr}`);
      const docSnap = await getDoc(availabilityRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Return default availability if not set
        return {
          hostId,
          date: Timestamp.fromDate(date),
          timeSlots: ["10:00", "11:00", "14:00", "15:00", "17:00", "17:30"],
          isDefault: true
        };
      }
    } catch (error) {
      console.error("Error getting availability: ", error);
      throw error;
    }
  },
  
  // Get a specific appointment by ID
  getAppointment: async (appointmentId) => {
    try {
      const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
      const docSnap = await getDoc(appointmentRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Appointment not found');
      }
    } catch (error) {
      console.error("Error getting appointment: ", error);
      throw error;
    }
  }
};

export default calendarService;