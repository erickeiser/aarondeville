
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
import IntakeSubmissions from './IntakeSubmissions';
import { useContent } from '../../hooks/useContent';
import WriteSuccessStoryForm from './forms/WriteSuccessStoryForm';
import ConsultationForm from './forms/ConsultationForm';
import IntakeFormForm from './forms/IntakeFormForm';
import { ClipboardCopyIcon, XIcon } from '../Icons';

type ActiveView = 
  | { type: 'general' | 'footer' | 'media' | 'pageStructure' | 'submissions' | 'intakeSubmissions' }
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

const FIX_SQL = `
-- 1. Add updated_at column if missing (Safe to run if exists)
ALTER TABLE public.website_content ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Create or Replace the safe update function
CREATE OR REPLACE FUNCTION safe_update_content(new_content jsonb, last_updated_at timestamptz)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  current_updated_at timestamptz;
BEGIN
  -- Get the current timestamp
  SELECT updated_at INTO current_updated_at FROM website_content WHERE id = 1;
  
  -- Check if the timestamp passed from the client matches the one in the DB
  -- If they are distinct, it means someone else updated it in the meantime
  IF current_updated_at IS DISTINCT FROM last_updated_at THEN
    RAISE EXCEPTION 'conflict';
  END IF;
  
  -- If safe, update content and timestamp
  UPDATE website_content 
  SET content = new_content, updated_at = now() 
  WHERE id = 1;
END;
$$;
`;

const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'pageStructure' });
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalCallback, setMediaModalCallback] = useState<(url: string) => void>(() => () => {});
  const [showSqlModal, setShowSqlModal] = useState(false);
  const { content, versioningStatus } = useContent();

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

  const copySql = () => {
      navigator.clipboard.writeText(FIX_SQL);
      alert('SQL copied to clipboard!');
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
      case 'intakeSubmissions': return <IntakeSubmissions />;
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
            {versioningStatus !== 'enabled' && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-lg flex justify-between items-center shadow-sm" role="alert">
                    <div>
                        <p className="font-bold flex items-center gap-2">
                             Warning: Save Conflict Detection is Disabled
                        </p>
                        {versioningStatus === 'no_column' && (
                            <p className="text-sm mt-1">Your database is missing the `updated_at` column. Data overwrites may occur.</p>
                        )}
                        {versioningStatus === 'no_function' && (
                            <p className="text-sm mt-1">Your database is missing the `safe_update_content` function. Data overwrites may occur.</p>
                        )}
                    </div>
                    <button 
                        onClick={() => setShowSqlModal(true)}
                        className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm font-bold hover:bg-yellow-700 transition-colors shadow-sm"
                    >
                        View Fix
                    </button>
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

       {/* SQL Fix Modal */}
       {showSqlModal && (
           <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={() => setShowSqlModal(false)}>
               <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                   <div className="flex justify-between items-center p-6 border-b">
                       <h2 className="text-xl font-bold text-gray-800">Fix Save Conflict Detection</h2>
                       <button onClick={() => setShowSqlModal(false)} className="text-gray-500 hover:text-gray-800">
                           <XIcon className="h-6 w-6" />
                       </button>
                   </div>
                   <div className="p-6 overflow-y-auto">
                       <p className="text-gray-600 mb-4">
                           Run the following SQL query in your Supabase SQL Editor to enable safe updates and prevent data overwrites.
                       </p>
                       <div className="relative group">
                           <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs leading-relaxed font-mono">
                               {FIX_SQL}
                           </pre>
                           <button 
                                onClick={copySql}
                                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors flex items-center gap-2 text-xs font-bold border border-white/20"
                            >
                                <ClipboardCopyIcon className="h-4 w-4" /> Copy SQL
                            </button>
                       </div>
                       <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800">
                           <strong>Steps:</strong>
                           <ol className="list-decimal list-inside mt-1 ml-1">
                               <li>Go to Supabase Dashboard {'>'} SQL Editor.</li>
                               <li>Create a New Query.</li>
                               <li>Paste the code above and run it.</li>
                               <li>Refresh this page.</li>
                           </ol>
                       </div>
                   </div>
                   <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
                       <button onClick={() => setShowSqlModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300">
                           Close
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default Admin;
