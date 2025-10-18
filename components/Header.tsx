import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import BlooviLogo from './BlooviLogo';

interface HeaderProps {
  setPage: (page: string) => void;
  currentPage: string;
}

const NavLink: React.FC<{ page: string, currentPage: string, setPage: (page: string) => void, children: React.ReactNode }> = ({ page, currentPage, setPage, children }) => (
  <button
    onClick={() => setPage(page)}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'text-lime-400' : 'text-gray-300 hover:text-white'}`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ setPage, currentPage }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { page: 'home', label: t.nav.home },
    { page: 'services', label: t.nav.services },
    { page: 'approach', label: t.nav.approach },
    { page: 'clients', label: t.nav.clients },
    { page: 'blog', label: t.nav.blog },
    { page: 'bloovi-ai', label: t.nav['bloovi-ai'] },
    { page: 'contact', label: t.nav.contact },
  ];

  if (currentUser?.isAdmin) {
    navItems.push({ page: 'dashboard', label: t.nav.dashboard });
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => setPage('home')}>
            <BlooviLogo />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(item => <NavLink key={item.page} page={item.page} currentPage={currentPage} setPage={setPage}>{item.label}</NavLink>)}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="font-bold text-sm px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors">
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            {currentUser ? (
               <button onClick={() => setPage('profile')} className="bg-lime-400 text-gray-900 font-bold py-2 px-4 rounded-full text-sm hover:bg-lime-300 transition-all">
                {t.nav.profile}
              </button>
            ) : (
              <div className="space-x-2">
                <button onClick={() => setPage('login')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-600 transition-all">
                  {t.nav.login}
                </button>
                 <button onClick={() => setPage('signup')} className="bg-lime-400 text-gray-900 font-bold py-2 px-4 rounded-full text-sm hover:bg-lime-300 transition-all">
                  {t.nav.signup}
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMenuOpen ? <line x1="18" y1="6" x2="6" y2="18"></line> : <line x1="3" y1="12" x2="21" y2="12"></line>}
                  {isMenuOpen ? <line x1="6" y1="6" x2="18" y2="18"></line> : <line x1="3" y1="6" x2="21" y2="6"></line>}
                  {isMenuOpen ? null : <line x1="3" y1="18" x2="21" y2="18"></line>}
                </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm absolute top-20 left-0 w-full">
            <nav className="flex flex-col items-center space-y-4 py-8">
              {navItems.map(item => <NavLink key={item.page} page={item.page} currentPage={currentPage} setPage={(p) => { setPage(p); setIsMenuOpen(false); }}>{item.label}</NavLink>)}
              <hr className="w-1/2 border-gray-700 my-4" />
              {currentUser ? (
                <button onClick={() => { setPage('profile'); setIsMenuOpen(false); }} className="w-3/4 bg-lime-400 text-gray-900 font-bold py-3 px-4 rounded-full text-base hover:bg-lime-300 transition-all">
                  {t.nav.profile}
                </button>
              ) : (
                <div className="w-3/4 space-y-4">
                    <button onClick={() => { setPage('login'); setIsMenuOpen(false); }} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-full text-base hover:bg-gray-600 transition-all">
                      {t.nav.login}
                    </button>
                     <button onClick={() => { setPage('signup'); setIsMenuOpen(false); }} className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-4 rounded-full text-base hover:bg-lime-300 transition-all">
                      {t.nav.signup}
                    </button>
                </div>
              )}
               <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="font-bold text-sm px-4 py-2 mt-4 rounded-md hover:bg-gray-700 transition-colors">
                 {language === 'en' ? 'العربية' : 'English'}
              </button>
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;