import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App'
import BookPage from './BookPage';
import CalendarPage from './CalendarPage';
import BookingForm from './BookingForm';
import Confirmation from './components/Confirmation';
import PersonalizedPage from './PersonalizedPage';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:extensionName" element={<PersonalizedPage />} />
          <Route path="/hello/:extensionName" element={<BookPage />} />
          <Route path="/calendar/:extensionName" element={<CalendarPage />} />
          <Route path="/booking-form/:extensionName" element={<BookingForm />} />
          <Route path="/confirmation/:extensionName" element={<Confirmation />} />
        </Routes>
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);