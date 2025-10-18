import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">{t.contactPage.title}</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t.contactPage.subtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl p-8 md:p-12 border border-gray-700">
          {submitted ? (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-lime-400">{t.contactPage.successMessage}</h2>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder={t.contactPage.form.name} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" required />
                <input type="email" placeholder={t.contactPage.form.email} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" required />
              </div>
              <input type="text" placeholder={t.contactPage.form.subject} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" required />
              <textarea placeholder={t.contactPage.form.message} rows={5} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400" required></textarea>
              <div className="text-center">
                <button type="submit" className="bg-lime-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-400/20">
                    {t.contactPage.form.send}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
