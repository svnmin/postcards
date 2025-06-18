//Spotify Types
export type Track = {
    id: string;
    name: string;
    artists: string;
    album: string;
    preview_url: string | null;
    external_url: string;
    image: string | null;
};

export type SpotifyTrack = {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    preview_url: string | null;
    external_urls: { spotify: string };
};

//Unsplash Types
export type UnsplashImage = {
    url: string;
    link: string;
    user: {
        name: string;
        username: string;
    };
};

//Postcard Props
export type PostcardProps = {
    message: string;
    track: Track;
    image?: UnsplashImage
};