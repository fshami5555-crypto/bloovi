import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';

interface HeroProps {
  setPage: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setPage }) => {
  const [offsetY, setOffsetY] = useState(0);
  const { t } = useLanguage();
  const { content } = useContent();
  
  const [titleIndex, setTitleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  const titles = t.hero.titles || [''];

  // Effect for rotating titles every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [titleIndex, titles.length]);

  // Effect for the typing animation
  useEffect(() => {
    setTypedText(''); // Reset text when title changes
    let currentText = '';
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < titles[titleIndex].length) {
        currentText += titles[titleIndex][charIndex];
        setTypedText(currentText);
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80); // Typing speed

    return () => clearInterval(typingInterval);
  }, [titleIndex, titles]);


  const handleScroll = () => setOffsetY(window.pageYOffset);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4 py-24 pt-32 md:pt-24">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${offsetY * 0.5}px)` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900"></div>
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-lime-400/20 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto flex flex-col items-center">
        <img
          src={content.images.hero}
          alt="Bloovi Media Abstract Shape"
          className="h-24 md:h-32 mb-8"
        />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight min-h-[120px] md:min-h-[168px] lg:min-h-[180px]">
          {typedText}
          <span className="opacity-75 animate-pulse">|</span>
        </h1>
        <p className="max-w-3xl text-lg md:text-xl text-gray-300 mb-8 -mt-4 md:-mt-8">
          {t.hero.subtitle}
        </p>
        <button
          onClick={() => setPage('contact')}
          className="bg-lime-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-lime-400/20"
        >
          {t.hero.cta}
        </button>
      </div>
    </section>
  );
};

export default Hero;