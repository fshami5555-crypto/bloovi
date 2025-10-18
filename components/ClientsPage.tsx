import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

const ClientsPage: React.FC = () => {
  const { t } = useLanguage();
  const { content } = useContent();
  const projects = content.images.clients;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">{t.clients.title}</h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t.clients.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-square">
              <img
                src={project.url}
                alt={project.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.alt}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;