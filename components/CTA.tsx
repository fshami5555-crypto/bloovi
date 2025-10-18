import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CTAProps {
  setPage: (page: string) => void;
}

const CTA: React.FC<CTAProps> = ({ setPage }) => {
  const { t } = useLanguage();
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight">
          {t.cta.title}
        </h2>
        <p className="text-gray-300 text-lg mt-6 mb-8">{t.cta.subtitle}</p>
        <button
          onClick={() => setPage('contact')}
          className="bg-lime-400 text-gray-900 font-bold py-4 px-10 rounded-full text-xl hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-400/20"
        >
          {t.cta.cta}
        </button>
      </div>
    </section>
  );
};

export default CTA;
