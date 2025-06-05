import { NextRequest, NextResponse } from 'next/server';

const tokenCache = {
  token: null as string | null,
  expiry: null as number | null,
};

async function getToken(): Promise<string> {
  if (tokenCache.token && tokenCache.expiry && Date.now() < tokenCache.expiry) {
    return tokenCache.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify client credentials');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Spotify token: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('No access token returned from Spotify');
  }

  tokenCache.token = data.access_token;
  tokenCache.expiry = Date.now() + data.expires_in * 1000;

  return tokenCache.token!;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');

  if (type !== 'search' || !q) {
    return NextResponse.json({ error: 'Invalid request. Use ?type=search&q=songname' }, { status: 400 });
  }

  try {
    const token = await getToken();
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Spotify API' }, { status: searchRes.status });
    }

    const data = await searchRes.json();
    const results = data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      image: track.album.images?.[0]?.url ?? null,
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error fetching Spotify search' }, { status: 500 });
  }
}