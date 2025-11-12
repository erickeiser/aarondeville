

import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import AdminLogin from './AdminLogin';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import GeneralForm from './forms/GeneralForm';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ServicesForm from './forms/ServicesForm';
import TestimonialsForm from './forms/TestimonialsForm';
import ContactForm from './forms/ContactForm';
import FooterForm from './forms/FooterForm';
import MediaLibrary from './MediaLibrary';
import MediaLibraryModal from './MediaLibraryModal';

const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('general');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalCallback, setMediaModalCallback] = useState<(url: string) => void>(() => () => {});

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  const openMediaLibrary = (onSelect: (url: string) => void) => {
    setMediaModalCallback(() => onSelect);
    setIsMediaModalOpen(true);
  };
  
  if(loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-xl">Loading Authentication...</p>
        </div>
    )
  }

  if (!session) {
    return <AdminLogin />;
  }

  const renderActiveView = () => {
    const props = { openMediaLibrary };
    switch (activeView) {
      case 'general': return <GeneralForm {...props} />;
      case 'hero': return <HeroForm {...props} />;
      case 'about': return <AboutForm {...props} />;
      // Fix: Removed props from ServicesForm as it does not accept any, which was causing a type error.
      case 'services': return <ServicesForm />;
      case 'testimonials': return <TestimonialsForm {...props} />;
      // Fix: Removed props from ContactForm as it does not accept any.
      case 'contact': return <ContactForm />;
      // Fix: Removed props from FooterForm as it does not accept any.
      case 'footer': return <FooterForm />;
      case 'media': return <MediaLibrary isModal={false} />;
      default: return <GeneralForm {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AdminHeader onLogout={handleLogout} />
      <div className="flex">
        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {renderActiveView()}
        </main>
      </div>
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => {
            mediaModalCallback(url);
            setIsMediaModalOpen(false);
        }}
       />
    </div>
  );
};

export default Admin;
