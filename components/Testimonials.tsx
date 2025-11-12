import React from 'react';
import { useContent } from '../hooks/useContent';
import { StarIcon, PlayIcon } from './Icons';

const TestimonialCard: React.FC<{ testimonial: any }> = ({ testimonial }) => (
  <div className="bg-[#1f1f1f] rounded-lg overflow-hidden flex flex-col">
    <div className="relative">
      <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <button className="bg-white/80 rounded-full p-3 hover:bg-white transition-transform hover:scale-110">
            <PlayIcon className="h-6 w-6 text-gray-900" />
        </button>
      </div>
      <div className="absolute top-2 right-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-md">{testimonial.tag}</div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <div className="flex items-center mb-4">
        <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div>
          <h4 className="font-bold">{testimonial.name}</h4>
          <p className="text-sm text-gray-400">{testimonial.achievement}</p>
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="h-5 w-5 text-orange-400" />
        ))}
      </div>
      <p className="text-gray-300 flex-grow">"{testimonial.quote}"</p>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  const { content } = useContent();
  const { testimonials: testimonialsContent } = content;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#121212]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">{testimonialsContent.headline}</h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
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
