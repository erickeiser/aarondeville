
import React from 'react';
import {
  CogIcon,
  HomeIcon,
  UserCircleIcon,
  FireIcon,
  StarIcon,
  MailIcon,
  ShieldCheckIcon,
  PhotographIcon
} from '../Icons';

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'general', label: 'General & Header', icon: <CogIcon className="h-5 w-5 mr-3" /> },
    { id: 'media', label: 'Media Library', icon: <PhotographIcon className="h-5 w-5 mr-3" /> },
    { id: 'hero', label: 'Hero Section', icon: <HomeIcon className="h-5 w-5 mr-3" /> },
    { id: 'about', label: 'About Section', icon: <UserCircleIcon className="h-5 w-5 mr-3" /> },
    { id: 'services', label: 'Services Section', icon: <FireIcon className="h-5 w-5 mr-3" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <StarIcon className="h-5 w-5 mr-3" /> },
    { id: 'contact', label: 'Contact Section', icon: <MailIcon className="h-5 w-5 mr-3" /> },
    { id: 'footer', label: 'Footer Section', icon: <ShieldCheckIcon className="h-5 w-5 mr-3" /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex-shrink-0">
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center text-sm font-medium ${
                  activeView === item.id 
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
      </nav>
    </aside>
  );
};

export default AdminSidebar;
