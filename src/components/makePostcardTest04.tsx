'use client';

import { useState } from 'react';
import { Track } from '@/types/types';
// import { handleSubmit } from '@/lib/firebaseRTDB';
import { handleSubmit } from '@/lib/firebaseFSDB';
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
  const onSubmit = async () => {
    // if(!message || !selectedTrack) return;
    if(!message || !selectedTrack){
      setError('need to finish the postcard');
      console.log('need to finish the postcard')
    }else{
      const id = await handleSubmit(message, selectedTrack);
      const url = `${window.location.origin}/postcard/${id}`;
      await navigator.clipboard.writeText(url);
      alert(`Postcard link copied! \n${url}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-black font-mono">
      <div className="w-full max-w-5xl h-[80vh] bg-white grid grid-cols-2 relative text-sm">
        {/* Center divider */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[520px] bg-black"></div>
        {/* Left section: Message */}
        <div className="flex items-center justify-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="( write your message here )"
            className="w-[80%] text-center text-black outline-none bg-transparent placeholder:text-black placeholder:opacity-100 font-mono"
          />
        </div>
        {/* Right section: Search, Results, Player, Button */}
        <div className="flex flex-col items-center pt-6 relative w-full font-mono">
            {/* Track preview */}
            {selectedTrack && (
                <div className="mb-4 w-[85%]">
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
            {/* Search bar */}
            <div className="flex w-[85%] max-w-md border border-black border-[1px] mb-4">
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="find your track here"
                className="text-black placeholder:text-black flex-1 px-4 py-2 outline-none bg-white font-mono"
                />
                <button
                onClick={trackSearch}
                className="px-4 py-2 text-black border-l border-black cursor-pointer font-mono"
                >
                search
                </button>
            </div>
            {/* Results list */}
            <div className="w-[80%] max-h-[500px] overflow-y-auto space-y-3">
                {results.map((track) => (
                <div key={track.id} className="border-b border-black pb-1">
                    <p className="font-bold text-black text-sm">{track.name}</p>
                    <p className="text-xs text-black">{track.artists}</p>
                    <button
                    className="text-red-500 text-xs hover:underline"
                    onClick={() => setSelectedTrack(track)}
                    >
                    CHOOSE
                    </button>
                </div>
                ))}
            </div>
            {/* Submit button */}
            <button
                onClick={onSubmit}
                className="absolute bottom-6 right-6 border border-black border-[1px] px-4 py-2 text-black text-sm cursor-pointer font-mono"
            >
                send postcard
            </button>
        </div>
      </div>
    </div>
  );
}
