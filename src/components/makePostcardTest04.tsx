'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Track } from '@/types/spotifyTypes';
import { handleSubmit } from '@/lib/firebase';


export default function MakePostcard04() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const trackSearch = async () => {
    if(!query) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/spotify?type=search&q=${encodeURIComponent(query)}`);
      if(!res.ok) {
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
    if(!message || !selectedTrack) return;
    const id = await handleSubmit(message, selectedTrack);
    const url = `${window.location.origin}/postcard/${id}`;
    await navigator.clipboard.writeText(url);
    alert(`Postcard link copied! 🎉\n${url}`);
    router.push(`/postcard/${id}`);
  };

  return (
    <main className="">
      <div className="">
        {/* Left side */}
        <div className="">
          <textarea
            placeholder="( write your message here )"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className=""
          />
        </div>

        {/* Right side */}
        <div className="">
          <div className="">
            <input
              type="text"
              placeholder="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className=""
            />
            <button
              onClick={trackSearch}
              className=""
            >
              find song
            </button>
          </div>

          {/* Send postcard button in bottom right */}
          <button
            onClick={onSubmit}
            disabled={!message || !selectedTrack}
            className=""
          >
            send postcard
          </button>
        </div>
      </div>
    </main>
  );
}
