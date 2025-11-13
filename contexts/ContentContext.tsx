

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { SiteContent, Section, SectionType, ContactContent } from '../types';
import { supabase } from '../lib/supabaseClient';

const defaultHeader = {
  siteName: 'Ari Deville Fitness',
  navLinks: [
    { text: 'Home', href: '#hero' },
    { text: 'About', href: '#about' },
    { text: 'Services', href: '#services' },
    { text: 'Success Stories', href: '#testimonials' },
    { text: 'Contact', href: '#contact' },
  ],
  ctaButton: 'Get Started',
};

const defaultSections: { [key in SectionType]: () => Omit<Section, 'id'> } = {
    hero: () => ({ type: 'hero', content: {
        headline1: 'Transform Your Body,',
        headline2: 'Transform Your Life',
        subheading: 'Professional personal training with proven results. I help busy professionals achieve their fitness goals through personalized workout plans, nutrition guidance, and unwavering support.',
        ctaButton1: 'Start Your Journey',
        ctaButton2: 'Learn More',
        stats: [
          { value: '200+', label: 'Clients Trained' },
          { value: '5+', label: 'Years Experience' },
          { value: '4.9', label: 'Average Rating' },
        ],
        imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2070&auto=format&fit=crop',
    }}),
    about: () => ({ type: 'about', content: {
        headline1: 'Meet Your Dedicated',
        headline2: 'Fitness Partner',
        paragraph1: 'Hi, I’m Alex Johnson, a certified personal trainer with over 5 years of experience helping people transform their lives through fitness. My journey began when I overcame my own health challenges, and now I’m passionate about guiding others on their path to wellness.',
        paragraph2: 'I believe fitness isn’t just about looking good – it’s about feeling confident, energized, and living your best life. Whether you’re a complete beginner or looking to break through plateaus, I’ll meet you where you are and help you reach where you want to be.',
        certificationsTitle: 'Certifications & Credentials',
        certifications: [
          { title: 'NASM-CPT', issuer: 'Certified Personal Trainer' },
          { title: 'ACE', issuer: 'Group Fitness Instructor' },
          { title: 'Precision Nutrition', issuer: 'Level 1 Coach' },
          { title: 'CPR/AED', issuer: 'First Aid Certified' },
        ],
        values: [
          { icon: 'HeartIcon', title: 'Passion for Fitness', description: 'Dedicated to helping you fall in love with fitness and make it a sustainable part of your lifestyle.' },
          { icon: 'TargetIcon', title: 'Goal-Oriented', description: 'Every workout is strategically designed to get you closer to your specific fitness objectives.' },
          { icon: 'ZapIcon', title: 'Proven Results', description: 'Track record of helping clients achieve remarkable transformations through science-based methods.' },
          { icon: 'ShieldCheckIcon', title: 'Safety First', description: 'Prioritizing proper form and injury prevention while maximizing your workout effectiveness.' },
        ],
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop',
    }}),
    services: () => ({ type: 'services', content: {
        headline: 'Training Services',
        subheading: 'Choose the perfect training option that fits your lifestyle, goals, and budget. All services include ongoing support and progress tracking.',
        plans: [
          { popular: true, title: 'Personal Training', price: '$80/session', description: 'One-on-one training sessions tailored to your specific goals and fitness level.', features: ['Personalized workout plans', 'Form correction and technique', 'Nutrition guidance', 'Progress tracking', 'Flexible scheduling'] },
          { popular: false, title: 'Group Training', price: '$40/session', description: 'Small group sessions (2-4 people) for a motivating and cost-effective workout.', features: ['Small group atmosphere', 'Shared motivation', 'Cost-effective training', 'Social workout experience', 'Customized group programs'] },
          { popular: false, title: 'Virtual Training', price: '$60/session', description: 'Online personal training sessions from the comfort of your home.', features: ['Train from anywhere', 'Live video sessions', 'Digital workout plans', 'Online progress tracking', 'Flexible scheduling'] },
          { popular: false, title: 'Nutrition Coaching', price: '$120/month', description: 'Comprehensive nutrition planning and coaching to complement your fitness goals.', features: ['Custom meal plans', 'Macro tracking guidance', 'Weekly check-ins', 'Recipe suggestions', 'Supplement recommendations'] },
        ]
    }}),
    consultation: () => ({ type: 'consultation', content: {
        headline: 'Free Consultation Available',
        subheading: 'Not sure which service is right for you? Book a free 30-minute consultation to discuss your goals and find the perfect training solution.',
        buttonText: 'Schedule Free Consultation',
    }}),
    testimonials: () => ({ type: 'testimonials', content: {
        headline: 'Client Success Stories',
        subheading: 'See real transformations from real people. These are just a few of the amazing journeys I’ve had the privilege to be part of.',
        stories: [
          { name: 'Sarah Johnson', achievement: 'Lost 30 lbs in 4 months', quote: 'The personalized approach made all the difference. I finally found a sustainable way to stay fit and healthy.', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop', tag: '-30 lbs' },
          { name: 'Mike Chen', achievement: 'Gained 15 lbs muscle', quote: 'Professional guidance and constant support helped me achieve goals I never thought possible.', imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop', tag: '+15 lbs muscle' },
          { name: 'Emily Rodriguez', achievement: 'Transformed lifestyle', quote: 'More than just fitness - this changed my entire relationship with health and wellness.', imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop', tag: 'Life changed' },
        ]
    }}),
    writeSuccessStory: () => ({ type: 'writeSuccessStory', content: {
        headline: 'Ready to Write Your Success Story?',
        paragraph: 'Join hundreds of clients who have transformed their lives through personalized training. Your journey to better health and confidence starts with a single step.',
        points: ['Personalized approach for every fitness level', 'Proven methods with measurable results', 'Ongoing support throughout your journey'],
        buttonText: 'Start Your Transformation',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
    }}),
    intakeForm: () => ({ type: 'intakeForm', content: {
        headline: 'Start Your Fitness Journey',
        subheading: 'Complete this intake form to help me understand your goals and create a personalized training plan just for you.',
    }}),
    contact: () => ({ type: 'contact', content: {
        headline: 'Get In Touch',
        subheading: { line1: "Ready to start your fitness journey? Have questions about training? I'm here to help.", line2: 'Send me a message or give me a call.'},
        connect: { title: "Let's Connect", paragraph: "I'm passionate about helping you achieve your fitness goals. Whether you're ready to get started or just have questions, I'd love to hear from you." },
        details: {
          email: { address: 'alex@fitprotrainer.com', note: 'I typically respond within 2-4 hours' },
          phone: { number: '(555) 123-4567', note: 'Call or text for immediate assistance' },
          location: { name: 'Downtown Fitness Center', address: '123 Main Street, City State 12345', note: 'Also available for home/virtual sessions' },
          availability: ['Monday - Friday: 6:00 AM – 8:00 PM', 'Saturday: 7:00 AM – 6:00 PM', 'Sunday: 8:00 AM – 4:00 PM'],
        },
        guarantee: { title: 'Quick Response Guarantee', text: "I pride myself on quick, personalized responses. Reach out with any questions about training, availability, or just to say hello. I'm here to support your fitness journey every step of the way." },
        form: {
          title: 'Send Me a Message',
          nameLabel: 'Your Name *',
          emailLabel: 'Email Address *',
          subjectLabel: 'Subject *',
          subjectPlaceholder: 'e.g., Questions about personal training',
          messageLabel: 'Message *',
          messagePlaceholder: 'Tell me about your fitness goals, questions, or how I can help you...',
          buttonText: 'Send Message',
        },
        notificationEmail: 'changeme@example.com',
    }}),
    video: () => ({ type: 'video', content: {
        headline: 'Featured Video',
        subheading: 'Check out this week\'s fitness tip!',
        videoId: 'g_tea8ZN-ZE', // A default YouTube video ID
    }}),
};

const defaultFooter = {
    tagline: 'Helping busy professionals transform their lives through personalized fitness training and nutrition coaching.',
    quickLinks: { title: 'Quick Links', getStarted: 'Get Started', admin: 'Admin Panel' },
    services: { title: 'Services', list: ['Personal Training', 'Small Group Training', 'Virtual Training', 'Nutrition Coaching', 'Free Consultation'] },
    contact: { title: 'Contact Info', hoursTitle: 'Hours:' },
    copyright: '© 2025 Ari Deville Fitness. All rights reserved.',
};

export const defaultContent: SiteContent = {
    header: defaultHeader,
    sections: [
        { id: 'hero', ...defaultSections.hero() },
        { id: 'about', ...defaultSections.about() },
        { id: 'services', ...defaultSections.services() },
        { id: 'consultation', ...defaultSections.consultation() },
        { id: 'testimonials', ...defaultSections.testimonials() },
        { id: 'writeSuccessStory', ...defaultSections.writeSuccessStory() },
        { id: 'intakeForm', ...defaultSections.intakeForm() },
        { id: 'contact', ...defaultSections.contact() },
    ],
    footer: defaultFooter,
};

export const availableSections = Object.keys(defaultSections).map(type => ({
    type: type as SectionType,
    name: type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ' Section'
}));

export const ContentContext = createContext<{
  content: SiteContent;
  setContent: (content: SiteContent) => Promise<boolean>;
  resetContent: () => void;
  addSection: (type: SectionType) => void;
  updateSectionContent: (sectionId: string, newContent: any) => Promise<boolean>;
  removeSection: (sectionId: string) => void;
  reorderSections: (sections: Section[]) => void;
  versioningEnabled: boolean;
}>({
  content: defaultContent,
  setContent: async () => false,
  resetContent: () => {},
  addSection: () => {},
  updateSectionContent: async () => false,
  removeSection: () => {},
  reorderSections: () => {},
  versioningEnabled: true,
});

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [versioningEnabled, setVersioningEnabled] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setCriticalError(null);
      // Attempt to fetch with the versioning column first
      let { data, error } = await supabase
        .from('website_content')
        .select('content, updated_at')
        .eq('id', 1)
        .single();

      // If the specific error for a missing column occurs ('42703: undefined_column'), fall back gracefully
      if (error && error.code === '42703') {
        console.warn("Versioning column 'updated_at' not found. Falling back to unsafe saves. Please run the database migration script to enable save conflict detection.");
        setVersioningEnabled(false);
        
        // Retry fetching only the content
        const secondAttempt = await supabase
          .from('website_content')
          .select('content')
          .eq('id', 1)
          .single();
        
        data = secondAttempt.data as any; // Cast to avoid TS errors, we know updated_at is missing
        error = secondAttempt.error;
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error.message);
        setCriticalError(`Could not load website data. This might be due to a network issue or a problem with the database setup (e.g., missing 'website_content' table or incorrect read permissions). Error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data && data.content) {
        const fetchedContent = data.content as SiteContent;
        if (!fetchedContent.header || !Array.isArray(fetchedContent.header.navLinks)) {
            fetchedContent.header = { ...fetchedContent.header, navLinks: defaultContent.header.navLinks };
        }
        if (!Array.isArray(fetchedContent.sections)) {
            fetchedContent.sections = defaultContent.sections;
        }
        setContentState(fetchedContent);
        if (data.updated_at) {
          setUpdatedAt(data.updated_at);
        }
      } else {
        console.log('No content found, initializing with default content.');
        const { error: insertError } = await supabase
          .from('website_content')
          .insert({ id: 1, content: defaultContent });
        
        if (insertError) {
            console.error('Error initializing content:', insertError.message);
            setCriticalError(`Successfully connected to the database, but could not create the initial website content. Please ensure the public 'anon' key has permission to insert into the 'website_content' table. Error: ${insertError.message}`);
            setLoading(false);
            return;
        }
        // After successful insert, try to get the new timestamp
        const { data: newData, error: newError } = await supabase.from('website_content').select('updated_at').eq('id', 1).single();
        if (newError) {
            console.warn('Could not fetch timestamp after insert. Versioning might be disabled.', newError.message);
            if (newError.code === '42703') {
                setVersioningEnabled(false);
            }
        } else if (newData) {
            setUpdatedAt(newData.updated_at);
        }
      }
      setLoading(false);
    };

    fetchContent();
  }, []);
  
  const updateDatabase = async (newContent: SiteContent): Promise<boolean> => {
    if (conflictError) return false;

    if (versioningEnabled) {
      const { error } = await supabase.rpc('safe_update_content', {
          new_content: newContent,
          last_updated_at: updatedAt,
      });

      if (error) {
          console.error('Error saving content:', error);
          if (error.message.includes('conflict')) {
              setConflictError('Your changes could not be saved because the content was updated by someone else. Please refresh the page to get the latest version. Your current changes will be lost.');
          } else {
              setConflictError(`An unexpected error occurred: ${error.message}`);
          }
          return false;
      } else {
          const { data } = await supabase.from('website_content').select('updated_at').eq('id', 1).single();
          if (data) setUpdatedAt(data.updated_at);
          return true;
      }
    } else {
      // Unsafe update without version checking
      const { error } = await supabase
        .from('website_content')
        .update({ content: newContent })
        .eq('id', 1);

      if (error) {
        console.error('Error saving content (unsafe):', error);
        setConflictError(`An unexpected error occurred: ${error.message}`);
        return false;
      }
      return true;
    }
  };

  const setContent = async (newContent: SiteContent): Promise<boolean> => {
    const success = await updateDatabase(newContent);
    if (success) {
      setContentState(newContent);
    }
    return success;
  };
  
  const resetContent = () => {
     if(window.confirm("Are you sure you want to reset ALL website content to default? This will update the database and cannot be undone.")){
        setContent(defaultContent);
    }
  }

  const addSection = (type: SectionType) => {
    const newSectionData = defaultSections[type]();
    const newSection: Section = {
        id: `${type}-${Date.now()}`,
        ...newSectionData,
    };
    const newContent = { ...content, sections: [...content.sections, newSection] };
    setContent(newContent);
  };

  const updateSectionContent = async (sectionId: string, newSectionContent: any): Promise<boolean> => {
    const newSections = content.sections.map(section =>
      section.id === sectionId ? { ...section, content: newSectionContent } : section
    );
    return await setContent({ ...content, sections: newSections });
  };
  
  const removeSection = (sectionId: string) => {
      if(window.confirm("Are you sure you want to delete this section? This action cannot be undone.")){
        const newSections = content.sections.filter(s => s.id !== sectionId);
        setContent({ ...content, sections: newSections });
      }
  };

  const reorderSections = (newSections: Section[]) => {
      setContent({ ...content, sections: newSections });
  };
  
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-[#E8E6DC]">
            <p className="text-xl">Loading Content...</p>
        </div>
    )
  }

  if (criticalError) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-900 p-8 font-sans">
            <div className="text-center max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">A critical error occurred</h1>
                <p className="bg-red-200 p-4 rounded-md text-left">{criticalError}</p>
                <p className="mt-4 text-sm">Please check the browser console for more details and verify your Supabase configuration, including table names and Row Level Security policies.</p>
            </div>
        </div>
    )
  }

  return (
    <ContentContext.Provider value={{ content, setContent, resetContent, addSection, updateSectionContent, removeSection, reorderSections, versioningEnabled }}>
      {children}
      {conflictError && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Save Conflict</h2>
                <p className="text-gray-700 mb-6">{conflictError}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      )}
    </ContentContext.Provider>
  );
};
