

import React, { useState, useEffect } from 'react';
// Fix: Import useContent from hooks/useContent.ts
import { ContentProvider } from './contexts/ContentContext';
import { useContent } from './hooks/useContent';
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
import { SiteContent, Section as SectionType } from './types';
import Video from './components/Video';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  hero: Hero,
  about: About,
  services: Services,
  consultation: Consultation,
  testimonials: Testimonials,
  writeSuccessStory: WriteSuccessStory,
  intakeForm: IntakeForm,
  contact: Contact,
  video: Video,
};

const PublicSite = () => {
  const { content } = useContent();

  return (
    <div className="bg-[#121212] text-white font-sans">
      <Header />
      <main>
        {content.sections.map((section: SectionType) => {
          const Component = componentMap[section.type];
          if (!Component) {
            return <div key={section.id}>Unknown section type: {section.type}</div>;
          }
          // @ts-ignore
          return <Component key={section.id} content={section.content} id={section.id} />;
        })}
      </main>
      <Footer />
    </div>
  );
};

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
      {route.startsWith('#/admin') ? <Admin /> : <PublicSite />}
    </ContentProvider>
  );
};

export default App;