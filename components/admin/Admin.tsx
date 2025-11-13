



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
import WriteSuccessStoryForm from './forms/WriteSuccessStoryForm';
import ConsultationForm from './forms/ConsultationForm';
import IntakeFormForm from './forms/IntakeFormForm';

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
  writeSuccessStory: WriteSuccessStoryForm,
  consultation: ConsultationForm,
  intakeForm: IntakeFormForm,
};


const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'pageStructure' });
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalCallback, setMediaModalCallback] = useState<(url: string) => void>(() => () => {});
  const { content, versioningEnabled } = useContent();

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

        const formProps: any = { sectionId: section.id };
        if (['hero', 'about', 'testimonials', 'writeSuccessStory'].includes(section.type)) {
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
            {!versioningEnabled && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-lg" role="alert">
                    <p className="font-bold">Warning: Save Conflict Detection is Disabled</p>
                    <p className="text-sm">Your database is missing a required column (`updated_at`). To prevent accidentally overwriting changes from other users, please run the SQL migration scripts provided previously.</p>
                </div>
            )}
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