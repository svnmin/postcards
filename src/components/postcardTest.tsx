'use client';
import { useState } from 'react';
import { Track } from '@/types/spotifyTypes';


export default function Postcard02() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="p-6 font-mono">
      <div className="mb-4">
        <label className="block text-white text-lg mb-2">what's the song?</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full"
          />
          <button
            onClick={trackSearch}
            className="bg-white text-black px-4 py-2 rounded-full"
          >
            Find song
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <p className="text-gray-500 text-lg mb-2">pick the song:</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-xl p-4 shadow space-y-3">
              {results.map((track) => (
                <div key={track.id} className="border-b pb-2">
                  <p className="font-bold text-sm">{track.name}</p>
                  <p className="text-xs text-gray-600 mb-1">{track.artists}</p>
                  <div className="flex gap-2 text-xs">
                    {track.preview_url && (
                      <a
                        href={track.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        PLAY
                      </a>
                    )}
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

            {selectedTrack && (
              <div className="w-80 bg-white text-white rounded-xl p-4">
                <img
                  src={selectedTrack.image || ''}
                  alt={selectedTrack.name}
                  className="rounded mb-4"
                />
                <p className="font-bold text-lg mb-1">{selectedTrack.name}</p>
                <p className="text-sm">Preview {selectedTrack.artists}</p>
                <a
                  href={selectedTrack.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 underline"
                >
                  Save on Spotify
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}