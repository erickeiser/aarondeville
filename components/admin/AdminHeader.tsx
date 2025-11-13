
import React from 'react';
import { useContent } from '../../hooks/useContent';

interface AdminHeaderProps {
    onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const { content } = useContent();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          CMS: <span className="font-normal">{content.header.siteName}</span>
        </h1>
        <button
          onClick={onLogout}
          className="bg-[#8C1E1E] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#7a1a1a] transition-colors"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;