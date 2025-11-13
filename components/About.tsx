

import React from 'react';
import { HeartIcon, TargetIcon, ZapIcon, ShieldCheckIcon } from './Icons';
import { AboutContent } from '../types';

const iconMap: { [key: string]: React.ReactNode } = {
  HeartIcon: <HeartIcon className="h-6 w-6 text-[#8C1E1E]" />,
  TargetIcon: <TargetIcon className="h-6 w-6 text-[#8C1E1E]" />,
  ZapIcon: <ZapIcon className="h-6 w-6 text-[#8C1E1E]" />,
  ShieldCheckIcon: <ShieldCheckIcon className="h-6 w-6 text-[#8C1E1E]" />,
};

interface AboutProps {
  content: AboutContent;
  id: string;
}

const About: React.FC<AboutProps> = ({ content: aboutContent, id }) => {
  return (
    <section id={id} className="py-20 md:py-28 bg-[#2B2B2B]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-left">
              {aboutContent.headline1} <span className="text-[#8C1E1E]">{aboutContent.headline2}</span>
            </h2>
            <p className="mt-6 text-[#E8E6DC]/90">
              {aboutContent.paragraph1}
            </p>
            <p className="mt-4 text-[#E8E6DC]/90">
              {aboutContent.paragraph2}
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">{aboutContent.certificationsTitle}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {aboutContent.certifications.map((cert, index) => (
                  <div key={index} className="bg-[#333333] p-4 rounded-lg">
                    <p className="font-bold">{cert.title}</p>
                    <p className="text-sm text-[#E8E6DC]/70">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 rounded-lg overflow-hidden">
                <img src={aboutContent.imageUrl} alt="Barbell in a gym" className="w-full h-auto object-cover"/>
            </div>
            {aboutContent.values.map((value, index) => (
              <div key={index} className="bg-[#333333] p-6 rounded-lg">
                <div className="bg-[#1A1A1A] h-12 w-12 rounded-full flex items-center justify-center mb-4">{iconMap[value.icon]}</div>
                <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                <p className="text-[#E8E6DC]/70 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;