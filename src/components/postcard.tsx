'use client';
import { useState } from 'react';

type Track = {
  id: string;
  name: string;
  artists: string;
  album: string;
  preview_url: string | null;
  external_url: string;
  image: string | null;
};

export default function Postcard() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchSongs = async () => {
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
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div>
        <label>What's the song?</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchSongs}>Find song</button>
      </div>

      {/* Search Results */}
      <div>
        <h2>Pick the song:</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {results.map((track) => (
          <div key={track.id}>
            <p>{track.name}</p>
            <p>{track.artists}</p>
            {track.preview_url ? (
                <button onClick={() => window.open(track.preview_url!, '_blank')}>Play</button>
            ) : null}
            <button onClick={() => setSelectedTrack(track)}>Choose</button>
          </div>
        ))}
      </div>

      {/* Selected Track Preview */}
      {selectedTrack && (
        <div>
          <h3>{selectedTrack.name} - {selectedTrack.artists}</h3>
          <a href={selectedTrack.external_url} target="_blank" rel="noopener noreferrer">
            Listen on Spotify
          </a>
          {selectedTrack.image && (
            <img src={selectedTrack.image} alt={selectedTrack.name} width={200} />
          )}
        </div>
      )}
    </div>
  );
}