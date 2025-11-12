


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
import PageStructure from './PageStructure';
import VideoForm from './forms/VideoForm';
import ContactSubmissions from './ContactSubmissions';
import { useContent } from '../../hooks/useContent';

type ActiveView = 
  | { type: 'general' | 'footer' | 'media' | 'pageStructure' | 'submissions' }
  | { type: 'section', id: string };

const componentFormMap: { [key: string]: React.ComponentType<any> } = {
  hero: HeroForm,
  about: AboutForm,
  services: ServicesForm,
  testimonials: TestimonialsForm,
  contact: ContactForm,
  video: VideoForm,
  // Sections without dedicated forms can be handled or ignored
  // Fix: Removed {...props} spread to prevent passing invalid attributes to the div element.
  consultation: (props: any) => <div className="bg-white p-6 rounded-lg shadow-sm border">This section is editable under "Site Settings".</div>,
  writeSuccessStory: (props: any) => <div className="bg-white p-6 rounded-lg shadow-sm border">This section is editable under "Site Settings".</div>,
  intakeForm: (props: any) => <div className="bg-white p-6 rounded-lg shadow-sm border">This section is editable under "Site Settings".</div>,
};


const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'pageStructure' });
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalCallback, setMediaModalCallback] = useState<(url: string) => void>(() => () => {});
  // Fix: Call useContent at the top level of the component to follow hook rules.
  const { content } = useContent();

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
    switch (activeView.type) {
      // Fix: GeneralForm does not accept any props, so remove the spread.
      case 'general': return <GeneralForm />;
      case 'footer': return <FooterForm />;
      case 'media': return <MediaLibrary isModal={false} />;
      case 'pageStructure': return <PageStructure />;
      case 'submissions': return <ContactSubmissions />;
      case 'section':
        const section = content.sections.find(s => s.id === activeView.id);
        if (!section) return <div>Section not found</div>;
        const FormComponent = componentFormMap[section.type];
        if (!FormComponent) return <div>No editor for this section type: {section.type}</div>;

        // Fix: Conditionally build props object to only pass `openMediaLibrary` to components that need it.
        // This resolves the error and makes the component logic more robust.
        const formProps: any = { sectionId: section.id };
        if (['hero', 'about', 'testimonials'].includes(section.type)) {
          formProps.openMediaLibrary = openMediaLibrary;
        }

        return <FormComponent {...formProps} />;
      default: return <PageStructure />;
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
// Helper hook to avoid prop-drilling within Admin component.
// Note: This is a simplified hook, and a more complex app might use a different pattern.
export default Admin;