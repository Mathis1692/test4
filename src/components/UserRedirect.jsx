import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant de redirection intelligent qui détermine où envoyer l'utilisateur
 * en fonction de son état d'authentification
 */
const UserRedirect = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Récupérer la destination prévue depuis les paramètres de state
  // ou utiliser le dashboard par défaut
  const destination = location.state?.from?.pathname || '/dashboard';
  
  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-purple-600">Préparation de votre espace...</p>
        </div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si l'email n'est pas vérifié, rediriger vers la page de vérification
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  // L'utilisateur est connecté et vérifié, rediriger vers sa destination
  return <Navigate to={destination} replace />;
};

export default UserRedirect;