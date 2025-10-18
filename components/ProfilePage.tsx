import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  setPage: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setPage }) => {
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setPage('home');
  };
  
  if (!currentUser) {
    // This should ideally be handled by a router, but this is a fallback.
    return null; 
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl text-center">
        <div className="bg-gray-800/50 rounded-2xl p-8 md:p-12 border border-gray-700">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.auth.profileTitle}</h1>
          <img 
             src={`https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.name}`}
             alt="User Avatar"
             className="w-32 h-32 rounded-full mx-auto my-8 bg-gray-700 border-4 border-lime-400"
            />
          <h2 className="text-3xl font-bold text-lime-400">{t.auth.welcomeMessage} {currentUser.name}</h2>
          <p className="text-lg text-gray-400 mt-2">{currentUser.email}</p>
          <p className="text-sm text-gray-500 mt-6">
            {t.auth.memberSince} {new Date(currentUser.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-10">
            <button 
              onClick={handleLogout}
              className="bg-gray-700 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-500 transition-all duration-300"
            >
              {t.auth.logoutButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
