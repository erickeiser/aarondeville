

import React from 'react';
import { CheckCircleIcon } from './Icons';
import { WriteSuccessStoryContent } from '../types';

interface WriteSuccessStoryProps {
  content: WriteSuccessStoryContent;
  id: string;
}

const WriteSuccessStory: React.FC<WriteSuccessStoryProps> = ({ content: storyContent, id }) => {
  return (
    <section id={id} className="pb-20 md:pb-28 bg-[#1A1A1A]">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-[#2B2B2B] to-[#333333] rounded-2xl p-8 md:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{storyContent.headline}</h2>
              <p className="mt-6 text-[#E8E6DC]/90">
                {storyContent.paragraph}
              </p>
              <ul className="mt-8 space-y-4">
                {storyContent.points.map((point, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-[#8C1E1E] mr-3" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <a href="#contact" className="bg-[#8C1E1E] text-[#E8E6DC] px-8 py-3 rounded-md font-semibold hover:bg-[#7a1a1a] transition-colors">
                  {storyContent.buttonText}
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <img src={storyContent.imageUrl} alt="Punching bag in a gym" className="rounded-xl shadow-lg w-full max-w-sm object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WriteSuccessStory;