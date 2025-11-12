
import React, { useState } from 'react';
import { useContent } from '../hooks/useContent';
import { UserIcon, MenuIcon, XIcon } from './Icons';

const Header: React.FC = () => {
  const { content } = useContent();
  const { header: headerContent } = content;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fallback for potentially malformed navLinks data
  const navLinks = Array.isArray(headerContent.navLinks) ? headerContent.navLinks : [];

  return (
    <header className="bg-[#121212]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <div className="bg-red-700 p-2 rounded-full">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">{headerContent.siteName}</span>
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link, index) => (
            <a key={index} href={link.href} className="text-gray-300 hover:text-white transition-colors">
              {link.text}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <a href="#contact" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">
            {headerContent.ctaButton}
          </a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#1f1f1f] pb-4">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                {link.text}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">
              {headerContent.ctaButton}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
