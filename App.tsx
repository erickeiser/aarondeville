import React, { useState, useEffect } from 'react';
import { ContentProvider } from './contexts/ContentContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Consultation from './components/Consultation';
import Testimonials from './components/Testimonials';
import WriteSuccessStory from './components/WriteSuccessStory';
import IntakeForm from './components/IntakeForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/admin/Admin';

const PublicSite = () => (
  <div className="bg-[#121212] text-white font-sans">
    <Header />
    <main>
      <Hero />
      <About />
      <Services />
      <Consultation />
      <Testimonials />
      <WriteSuccessStory />
      <IntakeForm />
      <Contact />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <ContentProvider>
      {route === '#/admin' ? <Admin /> : <PublicSite />}
    </ContentProvider>
  );
};

export default App;
