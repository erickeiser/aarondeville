

import React from 'react';
import {
  CogIcon,
  PhotographIcon,
  ShieldCheckIcon,
  HomeIcon,
  UserCircleIcon,
  FireIcon,
  StarIcon,
  MailIcon,
  VideoCameraIcon,
  MenuAlt2Icon,
  TemplateIcon
} from '../Icons';
import { useContent } from '../../hooks/useContent';
import { SectionType } from '../../types';

type ActiveView = 
  | { type: 'general' | 'footer' | 'media' | 'pageStructure' }
  | { type: 'section', id: string };

interface AdminSidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const sectionIcons: { [key in SectionType]: React.ReactNode } = {
    hero: <HomeIcon className="h-5 w-5 mr-3" />,
    about: <UserCircleIcon className="h-5 w-5 mr-3" />,
    services: <FireIcon className="h-5 w-5 mr-3" />,
    consultation: <StarIcon className="h-5 w-5 mr-3" />,
    testimonials: <StarIcon className="h-5 w-5 mr-3" />,
    writeSuccessStory: <TemplateIcon className="h-5 w-5 mr-3" />,
    intakeForm: <MenuAlt2Icon className="h-5 w-5 mr-3" />,
    contact: <MailIcon className="h-5 w-5 mr-3" />,
    video: <VideoCameraIcon className="h-5 w-5 mr-3" />,
};

const getSectionName = (type: SectionType) => {
    return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + ' Section';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  const { content } = useContent();

  const staticNavItems = [
    { id: 'pageStructure', label: 'Page Structure', icon: <TemplateIcon className="h-5 w-5 mr-3" /> },
    { id: 'general', label: 'Site Settings', icon: <CogIcon className="h-5 w-5 mr-3" /> },
    { id: 'media', label: 'Media Library', icon: <PhotographIcon className="h-5 w-5 mr-3" /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex-shrink-0">
      <nav>
        <ul>
          {staticNavItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveView({type: item.id as 'pageStructure' | 'general' | 'media' })}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center text-sm font-medium ${
                  activeView.type === item.id 
                  ? 'bg-red-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <h4 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Page Sections</h4>
         <ul>
          {content.sections.map((section) => (
            <li key={section.id} className="mb-1">
              <button
                onClick={() => setActiveView({ type: 'section', id: section.id })}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center text-sm font-medium ${
                  activeView.type === 'section' && activeView.id === section.id
                  ? 'bg-red-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {sectionIcons[section.type]}
                {getSectionName(section.type)}
              </button>
            </li>
          ))}
        </ul>
        <h4 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Other</h4>
        <ul>
            <li className="mb-2">
                 <button
                    onClick={() => setActiveView({type: 'footer'})}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center text-sm font-medium ${
                    activeView.type === 'footer'
                    ? 'bg-red-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                    <ShieldCheckIcon className="h-5 w-5 mr-3" />
                    Footer Section
                </button>
            </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;