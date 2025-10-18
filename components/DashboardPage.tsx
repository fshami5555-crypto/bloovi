import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './admin/UserManagement';
import TextContentManager from './admin/TextContentManager';
import ImageContentManager from './admin/ImageContentManager';
import BlogManager from './admin/BlogManager';
import SocialLinksManager from './admin/SocialLinksManager';

type Tab = 'users' | 'text' | 'images' | 'blog' | 'socials';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'users', label: t.dashboardPage.usersTab },
    { id: 'text', label: t.dashboardPage.textTab },
    { id: 'images', label: t.dashboardPage.imagesTab },
    { id: 'blog', label: t.dashboardPage.blogTab },
    { id: 'socials', label: t.dashboardPage.socialsTab },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'text':
        return <TextContentManager />;
      case 'images':
        return <ImageContentManager />;
      case 'blog':
        return <BlogManager />;
       case 'socials':
         return <SocialLinksManager />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t.dashboardPage.title}</h1>
          <p className="text-lg text-gray-400 mt-4">
            {t.dashboardPage.subtitle.replace('{name}', currentUser?.name || '')}
          </p>
        </div>

        <div className="flex justify-center border-b border-gray-700 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === tab.id ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
