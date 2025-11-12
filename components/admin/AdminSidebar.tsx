import React from 'react';

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'general', label: 'General & Header' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Section' },
    { id: 'services', label: 'Services Section' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact Section' },
    { id: 'footer', label: 'Footer Section' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeView === item.id 
                  ? 'bg-red-700 font-bold' 
                  : 'hover:bg-gray-700'
                }`}
              >
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
