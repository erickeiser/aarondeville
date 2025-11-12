import React from 'react';
import { useContent } from '../hooks/useContent';
import { CheckIcon } from './Icons';

const ServiceCard: React.FC<{ plan: any }> = ({ plan }) => {
  const isPopular = plan.popular;
  return (
    <div className={`rounded-xl p-8 flex flex-col h-full ${isPopular ? 'bg-white text-gray-800 border-4 border-red-700 relative' : 'bg-[#2a2a2a] text-white'}`}>
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-red-700 text-white text-sm font-bold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold">{plan.title}</h3>
      <p className={`text-4xl font-extrabold my-4 ${isPopular ? 'text-red-700' : 'text-red-600'}`}>{plan.price}</p>
      <p className={`mb-6 h-20 ${isPopular ? 'text-gray-600' : 'text-gray-400'}`}>{plan.description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <CheckIcon className={`h-6 w-6 mr-2 flex-shrink-0 ${isPopular ? 'text-red-700' : 'text-red-600'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition-colors mt-auto ${isPopular ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-gray-700 hover:bg-gray-600'}`}>
        Get Started
      </button>
    </div>
  );
};

const Services: React.FC = () => {
  const { content } = useContent();
  const { services: servicesContent } = content;

  return (
    <section id="services" className="py-20 md:py-28 bg-gray-200">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{servicesContent.headline}</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
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
