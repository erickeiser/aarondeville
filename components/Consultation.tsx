import React from 'react';
import { useContent } from '../hooks/useContent';

const Consultation: React.FC = () => {
  const { content } = useContent();
  const { consultation: consultationContent } = content;

  return (
    <section className="bg-gray-200 pb-20 md:pb-28">
      <div className="container mx-auto px-6">
        <div className="bg-red-800 rounded-2xl text-white text-center py-16 px-6">
          <h2 className="text-3xl md:text-4xl font-bold">{consultationContent.headline}</h2>
          <p className="mt-4 max-w-xl mx-auto">
            {consultationContent.subheading}
          </p>
          <button className="mt-8 bg-white text-red-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            {consultationContent.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
