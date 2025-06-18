//Spotify API
export type Track = {
    id: string;
    name: string;
    artists: string;
    album: string;
    preview_url: string | null;
    external_url: string;
    image: string | null;
};

//Unsplash API
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

//OpenPostcard Page Params
export type PageParams = {
    params: { id: string };
};