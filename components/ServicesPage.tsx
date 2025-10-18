import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ServicesPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold">{t.services.title}</h1>
                    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t.services.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {t.services.items.map((service, index) => (
                        <div key={index} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center">
                            <div className="text-5xl mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                            <p className="text-gray-400">A detailed description of this amazing service will go here, explaining the value and process for our clients.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
