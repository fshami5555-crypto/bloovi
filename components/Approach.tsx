import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Approach: React.FC = () => {
  const { t, language } = useLanguage();
  return (
    <section className="py-20 md:py-28 px-4 bg-gray-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t.approach.title}
          </h2>
          <p className="text-blue-400 text-lg mt-2">{t.approach.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {t.approach.items.map((step, index) => (
            <div key={index} className="relative">
              <div className={`absolute -top-4 ${language === 'ar' ? '-right-4' : '-left-4'} text-6xl font-bold text-gray-700/50 z-0`}>
                0{index + 1}
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-lime-400 mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
