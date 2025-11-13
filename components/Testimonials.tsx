

import React from 'react';
import { StarIcon, PlayIcon } from './Icons';
import { TestimonialsContent } from '../types';

const TestimonialCard: React.FC<{ testimonial: any }> = ({ testimonial }) => (
  <div className="bg-[#2B2B2B] rounded-lg overflow-hidden flex flex-col">
    <div className="relative">
      <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <button className="bg-[#E8E6DC]/80 rounded-full p-3 hover:bg-[#E8E6DC] transition-transform hover:scale-110">
            <PlayIcon className="h-6 w-6 text-[#1A1A1A]" />
        </button>
      </div>
      <div className="absolute top-2 right-2 bg-[#8C1E1E] text-[#E8E6DC] text-xs font-bold px-2 py-1 rounded-md">{testimonial.tag}</div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <div className="flex items-center mb-4">
        <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div>
          <h4 className="font-bold">{testimonial.name}</h4>
          <p className="text-sm text-[#E8E6DC]/70">{testimonial.achievement}</p>
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="h-5 w-5 text-[#8C1E1E]" />
        ))}
      </div>
      <p className="text-[#E8E6DC]/90 flex-grow">"{testimonial.quote}"</p>
    </div>
  </div>
);

interface TestimonialsProps {
  content: TestimonialsContent;
  id: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content: testimonialsContent, id }) => {
  return (
    <section id={id} className="py-20 md:py-28 bg-[#1A1A1A]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">{testimonialsContent.headline}</h2>
        <p className="mt-4 text-[#E8E6DC]/70 max-w-2xl mx-auto">
          {testimonialsContent.subheading}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left">
          {testimonialsContent.stories.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;