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
          className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
