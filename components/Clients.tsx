import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

const Clients: React.FC = () => {
  const { t } = useLanguage();
  const { content } = useContent();
  // Take the first 6 images for the homepage display
  const projects = content.images.clients.slice(0, 6);

  return (
    <section className="py-20 md:py-28 px-4 bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.clients.title}</h2>
          <p className="text-gray-400 mt-2">{t.clients.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-square">
              <img
                src={project.url}
                alt={project.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;