'use client';

import { useState } from 'react';
import { Track } from '@/types/types';
import { handleSubmit } from '@/lib/firebaseRTDB';
import { useRouter } from 'next/navigation';

export default function MakePostcard03() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const trackSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/spotify?type=search&q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await res.json();
      setResults(data.results);
      console.log(data.results)
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async () => {
    if (!message || !selectedTrack) return;
    const id = await handleSubmit(message, selectedTrack);
    const url = `${window.location.origin}/postcard/${id}`;
    await navigator.clipboard.writeText(url);
    alert(`Postcard link copied! \n${url}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="relative w-[960px] h-[680px] bg-white mx-auto">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[520px] bg-black"></div>
        <div className="w-1/2 h-full flex items-center justify-center">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="(write your message here)"
            className="w-100% h-100% bg-transparent text-center placeholder-gray-500 text-black resize-none focus:outline-none"
          />
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-between p-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="( find your song here )"
              className="flex-1 px-4 py-2 border border-black bg-transparent text-black placeholder:text-black"
            />
            <button
              onClick={trackSearch}
              className="px-4 py-2 border border-black text-black"
            >
              search
            </button>
          </div>
          {results.length > 0 && (
            <div className="mt-4 flex-1 overflow-y-auto">
              <p className="text-sm text-gray-700 mb-2">pick the song:</p>
              <div className="space-y-2">
                {results.map((track) => (
                  <div key={track.id} className="border border-black p-2">
                    <p className="text-sm font-bold text-black">{track.name}</p>
                    <p className="text-xs text-black mb-1">{track.artists}</p>
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => setSelectedTrack(track)}
                        className="text-blue-500 hover:underline"
                      >
                        PLAY
                      </button>
                      <button
                        onClick={() => setSelectedTrack(track)}
                        className="text-blue-500 hover:underline"
                      >
                        CHOOSE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedTrack && (
            <div className="mt-4">
              <iframe
                src={`https://open.spotify.com/embed/track/${selectedTrack.id}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded"
              ></iframe>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={onSubmit}
              className="px-4 py-2 border border-black text-black"
            >
              send postcard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
