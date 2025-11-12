
import React from 'react';
import { VideoContent } from '../types';
import { VideoCameraIcon } from './Icons';

interface VideoProps {
  content: VideoContent;
  id: string;
}

const Video: React.FC<VideoProps> = ({ content, id }) => {
  const embedUrl = `https://www.youtube.com/embed/${content.videoId}`;

  return (
    <section id={id} className="py-20 md:py-28 bg-[#1f1f1f]">
      <div className="container mx-auto px-6 text-center">
        <div className="inline-block bg-red-800 p-3 rounded-full mb-4">
            <VideoCameraIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white">{content.headline}</h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {content.subheading}
        </p>
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl shadow-red-500/10">
            <iframe
              src={embedUrl}
              title={content.headline}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video;
