'use client';

import React from 'react';

interface Track {
  id: string;
  name: string;
  artists: string;
  external_url: string;
}
interface PostcardProps {
  message: string;
  track: Track;
}

export default function OpenPostcard01({ message, track }: PostcardProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-5xl h-[80vh] border border-black grid grid-cols-2 relative text-sm bg-white">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[520px] bg-black"></div>
        {/* Left: Message */}
        <div className="flex items-center justify-center">
          <div className="w-4/5 text-center text-black whitespace-pre-wrap">{message}</div>
        </div>

        {/* Right: Spotify Player */}
        <div className="flex flex-col items-center justify-center px-8">3
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