import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Approach from './Approach';
import Clients from './Clients';
import CTA from './CTA';
import AIAnalyzer from './AIAnalyzer'; // Import the new component

interface HomePageProps {
  setPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  return (
    <>
      <Hero setPage={setPage} />
      <AIAnalyzer setPage={setPage} /> {/* Add the new component here */}
      <Services />
      <Approach />
      <Clients />
      <CTA setPage={setPage} />
    </>
  );
};

export default HomePage;