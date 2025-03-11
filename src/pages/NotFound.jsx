// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">Page introuvable</p>
        <p className="text-gray-500 mt-2 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;