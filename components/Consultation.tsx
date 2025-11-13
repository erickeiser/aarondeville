

import React from 'react';
import { ConsultationContent } from '../types';

interface ConsultationProps {
  content: ConsultationContent;
  id: string;
}

const Consultation: React.FC<ConsultationProps> = ({ content: consultationContent, id }) => {
  return (
    <section id={id} className="bg-[#E8E6DC] pb-20 md:pb-28">
      <div className="container mx-auto px-6">
        <div className="bg-[#8C1E1E] rounded-2xl text-[#E8E6DC] text-center py-16 px-6">
          <h2 className="text-3xl md:text-4xl font-bold">{consultationContent.headline}</h2>
          <p className="mt-4 max-w-xl mx-auto">
            {consultationContent.subheading}
          </p>
          <a href="#contact" className="mt-8 inline-block bg-[#E8E6DC] text-[#8C1E1E] px-8 py-3 rounded-lg font-semibold hover:bg-[#d9d7ce] transition-colors">
            {consultationContent.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Consultation;