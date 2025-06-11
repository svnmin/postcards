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
export type UnsplashUser = {
  name: string;
  username: string;
}
export type UnsplashImage = {
  url: string;
  user: UnsplashUser;
  link: string;
}