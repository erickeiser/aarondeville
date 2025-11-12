

import React from 'react';
import { UsersIcon, StarIcon, BadgeCheckIcon } from './Icons';
import { HeroContent } from '../types';

interface HeroProps {
  content: HeroContent;
  id: string;
}

const Hero: React.FC<HeroProps> = ({ content: heroContent, id }) => {
  const isVideo = heroContent.imageUrl && heroContent.imageUrl.match(/\.(mp4|webm|mov)$/i);

  return (
    <section id={id} className="py-20 md:py-32 bg-gradient-to-b from-[#1f1f1f] to-[#121212]">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {heroContent.headline1}
            <br />
            <span className="text-orange-500">{heroContent.headline2}</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
            {heroContent.subheading}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#services" className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
              {heroContent.ctaButton1} <span className="text-xl">→</span>
            </a>
            <a href="#about" className="bg-transparent border-2 border-gray-600 text-gray-300 px-8 py-3 rounded-md font-semibold hover:bg-gray-800 hover:border-gray-800 transition-colors flex items-center justify-center">
              {heroContent.ctaButton2}
            </a>
            <a href="#contact" className="bg-red-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-800 transition-colors flex items-center justify-center">
              {heroContent.ctaButton3}
            </a>
          </div>
          <div className="mt-16 flex justify-center md:justify-start space-x-8 sm:space-x-12">
            {heroContent.stats.map((stat, index) => (
              <div key={index} className="text-center">
                {stat.label === "Clients Trained" && <UsersIcon className="h-8 w-8 mx-auto text-orange-500" />}
                {stat.label === "Years Experience" && <BadgeCheckIcon className="h-8 w-8 mx-auto text-orange-500" />}
                {stat.label === "Average Rating" && <StarIcon className="h-8 w-8 mx-auto text-orange-500" />}
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 w-full max-w-sm">
            {isVideo ? (
              <video 
                src={heroContent.imageUrl} 
                className="w-full h-auto object-cover"
                autoPlay
                loop
                muted
                playsInline
                key={heroContent.imageUrl}
              />
            ) : (
              <img src={heroContent.imageUrl} alt="Fit personal trainer" className="w-full h-auto object-cover" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;