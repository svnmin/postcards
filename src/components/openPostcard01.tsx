'use client';

import React from 'react';
import { Track, UnsplashImage } from '@/types/types';

type PostcardProps = {
  message: string;
  track: Track;
  image?: UnsplashImage;
};

export default function OpenPostcard01({ message, track, image }: PostcardProps) {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 font-mono relative bg-black">
      {/* Postcard wrapper */}
      <div className="relative z-10 w-full max-w-5xl h-[80vh] border border-black grid grid-cols-2 bg-white text-sm backdrop-blur-md overflow-hidden">
        {/* Background image inset */}
        {image?.url && (
          <div className="absolute inset-5 z-0">
            <img
              src={image.url}
              alt="Postcard background"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        {/* Divider */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[520px] bg-black z-20"></div>

        {/* Left: Message */}
        <div className="flex items-center justify-center p-6 relative z-30">
          <div className="w-4/5 text-center text-black whitespace-pre-wrap">{message}</div>
        </div>

        {/* Right: Spotify Player */}
        <div className="flex flex-col items-center justify-center px-8 relative z-30">
          <iframe
            src={`https://open.spotify.com/embed/track/${track.id}`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded"
          ></iframe>
        </div>
      </div>
    </div>
  );
}