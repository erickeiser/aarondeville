import React from 'react';
import { useContent } from '../hooks/useContent';
import { UserIcon, MailIcon, PhoneIcon } from './Icons';

const Footer: React.FC = () => {
  const { content } = useContent();
  const { footer: footerContent, header, contact } = content;

  return (
    <footer className="bg-[#121212] border-t border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div>
             <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="bg-red-700 p-2 rounded-full">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">{header.siteName}</span>
            </a>
            <p className="text-gray-400">
              {footerContent.tagline}
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{footerContent.quickLinks.title}</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white">{header.navLinks.home}</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white">{header.navLinks.about}</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white">{header.navLinks.services}</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white">{header.navLinks.successStories}</a></li>
              <li><a href="#intake-form" className="text-gray-400 hover:text-white">{footerContent.quickLinks.getStarted}</a></li>
              <li><a href="#/admin" className="text-red-600 hover:text-red-500 font-semibold text-sm mt-2 inline-block">{footerContent.quickLinks.admin}</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{footerContent.services.title}</h4>
            <ul className="space-y-2">
              {footerContent.services.list.map((service, index) => (
                 <li key={index} className="text-gray-400">{service}</li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{footerContent.contact.title}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MailIcon className="h-5 w-5 text-red-500" />
                {contact.details.email.address}
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <PhoneIcon className="h-5 w-5 text-red-500" />
                {contact.details.phone.number}
              </li>
            </ul>
             <div className="mt-4">
                <h5 className="font-semibold text-gray-200">{footerContent.contact.hoursTitle}</h5>
                {contact.details.availability.map((line, index) => (
                    <p key={index} className="text-sm text-gray-400">{line}</p>
                ))}
             </div>
          </div>

        </div>
      </div>
      <div className="bg-[#0a0a0a] py-4">
          <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
            {footerContent.copyright}
          </div>
      </div>
       <button onClick={() => window.location.href='#contact'} className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-40" aria-label="Contact">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        </button>
    </footer>
  );
};

export default Footer;