import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SignupPageProps {
  setPage: (page: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ setPage }) => {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup(name, email, password); // Pass password to signup function
      // On successful signup, AuthContext logs the user in and App will redirect.
    } catch (err: any) {
      setError(t.auth[err.message as keyof typeof t.auth] || t.auth.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{t.auth.signupTitle}</h1>
          <p className="text-lg text-gray-400 mt-4">{t.auth.signupSubtitle}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-8 md:p-10 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">{t.auth.nameLabel}</label>
              <input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" 
                required 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">{t.auth.emailLabel}</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" 
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">{t.auth.passwordLabel}</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" 
                required 
              />
            </div>
             {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <div className="text-center pt-2">
              <button 
                type="submit" 
                className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
                disabled={isLoading}
              >
                 {isLoading ? '...' : t.auth.signupButton}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-400">
              {t.auth.haveAccount}{' '}
              <button onClick={() => setPage('login')} className="font-semibold text-lime-400 hover:text-lime-300">{t.auth.loginButton}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;