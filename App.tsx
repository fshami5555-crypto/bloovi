import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import ApproachPage from './components/ApproachPage';
import ClientsPage from './components/ClientsPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import DashboardPage from './components/DashboardPage';
import BlogPage from './components/BlogPage';
import SinglePostPage from './components/SinglePostPage';
import Chatbot from './components/Chatbot';
import BlooviAIPage from './components/BlooviAIPage'; // Import the new AI page
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const { currentUser } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Handle redirects for authenticated users
  useEffect(() => {
    if (currentUser) {
      if (page === 'login' || page === 'signup') {
        setPage(currentUser.isAdmin ? 'dashboard' : 'profile');
      }
    } else {
      if (page === 'profile' || page === 'dashboard') {
        setPage('login');
      }
    }
  }, [currentUser, page]);
  
  const renderPage = () => {
    if (page.startsWith('blog/')) {
        const postId = parseInt(page.split('/')[1], 10);
        return <SinglePostPage postId={postId} setPage={setPage} />;
    }

    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'services':
        return <ServicesPage />;
      case 'approach':
        return <ApproachPage />;
      case 'clients':
        return <ClientsPage />;
      case 'bloovi-ai': // Add the route for the new page
        return <BlooviAIPage setPage={setPage} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'signup':
        return <SignupPage setPage={setPage} />;
      case 'profile':
        return currentUser ? <ProfilePage setPage={setPage} /> : <LoginPage setPage={setPage} />;
      case 'dashboard':
        return currentUser?.isAdmin ? <DashboardPage /> : <HomePage setPage={setPage} />;
      case 'blog':
        return <BlogPage setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white font-sans">
      <Header setPage={setPage} currentPage={page} />
      <main>
        {renderPage()}
      </main>
      <Footer />
      {!currentUser?.isAdmin && <Chatbot />}
    </div>
  );
};

export default App;