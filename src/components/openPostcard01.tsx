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
    <main className="min-h-screen flex items-center justify-center bg-black text-black">
      <div className="w-[90%] h-[90vh] bg-white flex border border-black">
        {/* Left: Message */}
        <div className="w-1/2 h-full border-r border-black flex items-center justify-center">
          <div className="w-4/5 text-center text-lg whitespace-pre-wrap">{message}</div>
        </div>

        {/* Right: Spotify Player */}
        <div className="w-1/2 h-full flex flex-col items-center justify-center px-8">
          <p className="text-sm text-center mb-4">
            {track.name} — {track.artists}
          </p>
          <iframe
            src={`https://open.spotify.com/embed/track/${track.id}`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded"
          ></iframe>
          <a
            href={track.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 underline text-sm"
          >
            Open in Spotify
          </a>
        </div>
      </div>
    </main>
  );
}