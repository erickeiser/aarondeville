

import React from 'react';
import { CheckIcon } from './Icons';
import { ServicesContent } from '../types';

const ServiceCard: React.FC<{ plan: any }> = ({ plan }) => {
  const isPopular = plan.popular;
  return (
    <div className={`rounded-xl p-8 flex flex-col h-full ${isPopular ? 'bg-[#1A1A1A] text-[#E8E6DC] border-4 border-[#8C1E1E] relative pt-12' : 'bg-[#3C4452] text-[#E8E6DC]'}`}>
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[#8C1E1E] text-[#E8E6DC] text-sm font-bold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold">{plan.title}</h3>
      <p className={`text-4xl font-extrabold my-4 ${isPopular ? 'text-[#8C1E1E]' : 'text-[#E8E6DC]'}`}>{plan.price}</p>
      <p className={`mb-6 ${isPopular ? 'text-[#E8E6DC]/90' : 'text-[#E8E6DC]/90'}`}>{plan.description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <CheckIcon className={`h-6 w-6 mr-2 flex-shrink-0 ${isPopular ? 'text-[#E8E6DC]' : 'text-[#E8E6DC]'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition-colors mt-auto ${isPopular ? 'bg-[#8C1E1E] text-[#E8E6DC] hover:bg-[#7a1a1a]' : 'bg-[#1A1A1A] text-[#E8E6DC] hover:bg-black'}`}>
        Get Started
      </button>
    </div>
  );
};

interface ServicesProps {
  content: ServicesContent;
  id: string;
}

const Services: React.FC<ServicesProps> = ({ content: servicesContent, id }) => {
  return (
    <section id={id} className="py-20 md:py-28 bg-[#E8E6DC]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">{servicesContent.headline}</h2>
        <p className="mt-4 text-[#1A1A1A]/90 max-w-2xl mx-auto">
          {servicesContent.subheading}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 text-left">
          {servicesContent.plans.map((plan, index) => (
            <ServiceCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;