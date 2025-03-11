import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Pages publiques
import LandingPage from './LandingPage';
import NotFound from './pages/NotFound';

// Pages d'authentification
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';

// Pages d'application nécessitant authentification
import Dashboard from './pages/Dashboard';
import CalendarSettings from './pages/CalendarSettings';
import ProfileSettings from './pages/ProfileSettings';

// Pages de réservation public
import CalendarPage from './pages/CalendarPage';
import BookingForm from './pages/BookingForm';
import Confirmation from './components/Confirmation';

// Composants de contrôle d'accès
import ProtectedRoute from './components/ProtectedRoute';
import UserRedirect from './components/UserRedirect';

// Context Providers
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <PreferencesProvider>
          <Router>
            <Routes>
              {/* ===== ROUTES PUBLIQUES ===== */}
              {/* Page d'accueil */}
              <Route path="/" element={<LandingPage />} />
              
              {/* ===== ROUTES D'AUTHENTIFICATION ===== */}
              {/* Ces routes sont accessibles même si l'utilisateur est déjà connecté */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* ===== ROUTE DE REDIRECTION APRÈS AUTHENTIFICATION ===== */}
              {/* Route pour rediriger l'utilisateur après connexion */}
              <Route path="/redirect" element={<UserRedirect />} />
              
              {/* ===== ROUTES PROTÉGÉES ===== */}
              {/* Ces routes nécessitent une authentification et une vérification de l'e-mail */}
              <Route element={<ProtectedRoute requireVerification={true} />}>
                {/* Dashboard de l'utilisateur */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Pages de paramètres regroupées */}
                <Route path="/settings">
                  <Route path="calendar" element={<CalendarSettings />} />
                  <Route path="profile" element={<ProfileSettings />} />
                </Route>
              </Route>
              
              {/* ===== ROUTES DE RÉSERVATION PUBLIQUES ===== */}
              {/* Ces routes sont accessibles par tout le monde */}
              <Route path="/calendar/:username" element={<CalendarPage />} />
              
              {/* Attention à l'ordre des routes - les routes plus spécifiques doivent être placées avant les moins spécifiques */}
              <Route path="/booking/confirmation/:username" element={<Confirmation />} />
              <Route path="/booking/:username" element={<BookingForm />} />
              <Route path="/confirmation/:username" element={<Confirmation />} />
              
              {/* ===== GESTION DES ERREURS ===== */}
              {/* Page 404 */}
              <Route path="/404" element={<NotFound />} />
              
              {/* ===== ROUTE DYNAMIQUE PERSONNELLE ===== */}
              {/* Cette route doit rester en dernier pour éviter de capturer d'autres routes */}
              <Route path="/:username" element={<CalendarPage />} />
              
              {/* Route par défaut - redirige vers 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </PreferencesProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);