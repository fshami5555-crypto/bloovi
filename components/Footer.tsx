import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import BlooviLogo from './BlooviLogo';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { content } = useContent();

  // FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  const socialIcons: { [key: string]: React.ReactNode } = {
    facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
    twitter: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
    linkedin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    instagram: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  };


  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About */}
          <div className="space-y-4">
            <div className="inline-block md:block">
               <BlooviLogo />
            </div>
            <p className="text-gray-400 max-w-sm mx-auto md:mx-0">
                {t.footer.description}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-lime-400 transition-colors">Services</a></li>
              <li><a href="#approach" className="text-gray-400 hover:text-lime-400 transition-colors">Approach</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-lime-400 transition-colors">Blog</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-lime-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.contactInfo}</h3>
            <p className="text-gray-400">{t.footer.email}</p>
            <p className="text-gray-400">{t.footer.phone}</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              {content.socials.map(social => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition-colors">
                  {socialIcons[social.id]}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 border-t border-gray-800 mt-12 pt-8">
            <p>{t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;