import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceCardProps {
  title: string;
  icon: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, icon }) => (
  <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-lime-400 transition-all duration-300 transform hover:-translate-y-2">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
  </div>
);

const Services: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 md:py-28 px-4 bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.services.title}</h2>
          <p className="text-gray-400 mt-2">{t.services.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.services.items.map((service, index) => (
            <ServiceCard key={index} title={service.title} icon={service.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
