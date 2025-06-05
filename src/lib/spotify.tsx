const tokenCache = {
    token : null as string | null,
    expiry : null as number | null,
};

export async function getToken() : Promise<string> {
    if(tokenCache.token && tokenCache.expiry && Date.now() < tokenCache.expiry){
        return tokenCache.token;
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method : 'POST',
        headers : {
            Authorization : `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body : 'grant_type=client_credentials',
    });
    if(!res.ok){
        throw new Error(`Failed to fetch Spotify token: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if(!data.access_token){
        throw new Error('No access token returned from Spotify');
    }
    tokenCache.token = data.access_token;
    tokenCache.expiry = Date.now() + data.expires_in * 1000;

    return tokenCache.token!;
}