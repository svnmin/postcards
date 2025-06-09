'use client';

import { useState } from 'react';
import { Track } from '@/types/spotifyTypes';
import { handleSubmit } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function MakePostcard04() {
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

  // const onSubmit = async () => {
  //   if (!message || !selectedTrack) return;
  //   const id = await handleSubmit(message, selectedTrack);
  //   // router.push(`/postcard/${id}`);
  //   console.log(`/postcard/${id}`)
  // };
  const onSubmit = async () => {
    if (!message || !selectedTrack) return;
    const id = await handleSubmit(message, selectedTrack);
    const url = `${window.location.origin}/postcard/${id}`;
    await navigator.clipboard.writeText(url);
    alert(`Postcard link copied! 🎉\n${url}`);
    router.push(`/postcard/${id}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-black">
      <div className="w-[90%] h-[90vh] bg-white flex border border-black">
        {/* Left side */}
        <div className="w-1/2 h-full border-r border-black flex items-center justify-center">
          <textarea
            placeholder="( write your message here )"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-4/5 h-1/3 text-center bg-transparent placeholder-black/50 outline-none resize-none"
          />
        </div>

        {/* Right side */}
        <div className="w-1/2 h-full relative flex items-center justify-center">
          <div className="flex items-center border border-black w-4/5 px-2 py-1">
            <input
              type="text"
              placeholder="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder-black/50"
            />
            <button
              onClick={trackSearch}
              className="border-l border-black px-2 text-sm"
            >
              find song
            </button>
          </div>

          {/* Send postcard button in bottom right */}
          <button
            onClick={onSubmit}
            disabled={!message || !selectedTrack}
            className="absolute bottom-4 right-4 border border-black px-3 py-1 text-sm disabled:text-black/30"
          >
            send postcard
          </button>
        </div>
      </div>
    </main>
  );
}
