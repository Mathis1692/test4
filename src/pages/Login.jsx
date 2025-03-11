import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loading, login } = useAuth();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  
  // Vérifier si l'utilisateur vient juste de vérifier son email
  const verified = new URLSearchParams(location.search).get('verified') === 'true';
  
  // IMPORTANT: Cette logique ne redirige pas automatiquement les utilisateurs déjà connectés
  // Elle vérifie seulement si une connexion vient de réussir
  useEffect(() => {
    // Si l'utilisateur vient de se connecter avec succès (via le handleSubmit)
    if (isSuccessful && currentUser) {
      // Rediriger vers la page souhaitée ou vers /redirect qui s'occupera de la redirection intelligente
      navigate('/redirect', { 
        state: { from: location.state?.from || { pathname: '/dashboard' } },
        replace: true
      });
    }
  }, [isSuccessful, currentUser, navigate, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsSubmitting(true);
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setIsSuccessful(true);
        // La redirection sera gérée par le useEffect ci-dessus
      } else {
        setError(result.error || 'Une erreur est survenue lors de la connexion.');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un état de chargement pendant la vérification de l'état d'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-purple-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Bouton Retour */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 z-50 flex items-center px-4 py-2 bg-white shadow-md rounded-lg text-purple-600 hover:text-purple-800 border border-purple-200 transition-all hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à l'accueil
      </Link>
      
      <div className="max-w-md w-full relative z-10">
        {/* Message de succès si l'email a été vérifié */}
        {verified && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
            Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.
          </div>
        )}
        
        <form 
          className="flex flex-col gap-3 p-6 rounded-2xl relative bg-white text-gray-800 border border-purple-100 shadow-xl"
          onSubmit={handleSubmit}
        >
          {/* Titre avec point animé */}
          <p className="text-2xl font-semibold tracking-tight pl-8 text-purple-600 relative flex items-center">
            <span className="absolute left-0 w-4 h-4 bg-purple-500 rounded-full"></span>
            <span className="absolute left-0 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></span>
            Connexion
          </p>
          
          <p className="text-sm text-gray-500 mb-2">
            Accédez à votre tableau de bord
          </p>
          
          {/* Afficher l'erreur si présente */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Champ email */}
          <label className="relative">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
              placeholder=""
            />
            <span className="text-gray-500 absolute left-3 top-0 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-purple-500 peer-valid:top-0 peer-valid:text-xs peer-valid:font-semibold">
              Email
            </span>
          </label>
          
          {/* Champ mot de passe */}
          <label className="relative">
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-50 text-gray-800 w-full py-3 px-3 outline-none border border-gray-200 rounded-lg focus:border-purple-400 peer"
              placeholder=""
            />
            <span className="text-gray-500 absolute left-3 top-0 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-purple-500 peer-valid:top-0 peer-valid:text-xs peer-valid:font-semibold">
              Mot de passe
            </span>
          </label>
          
          {/* Lien mot de passe oublié */}
          <div className="text-right">
            <Link to="/reset-password" className="text-sm text-purple-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          
          {/* Bouton de soumission */}
          <button 
            type="submit" 
            className="border-none px-4 py-3 rounded-lg text-white text-base transition-all duration-300 bg-purple-600 hover:bg-purple-500/90 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          {/* Lien d'inscription */}
          <p className="text-center text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link to="/signup" className="text-purple-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;