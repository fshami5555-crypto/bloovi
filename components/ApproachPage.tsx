import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ApproachPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold">{t.approach.title}</h1>
          <p className="text-lg text-blue-400 mt-4">{t.approach.subtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-16">
          {t.approach.items.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="text-7xl font-bold text-lime-400/50 md:w-1/4">0{index + 1}</div>
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 text-lg">{step.description} We take this step very seriously, ensuring every detail is covered to deliver exceptional results that align with your business goals.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApproachPage;
