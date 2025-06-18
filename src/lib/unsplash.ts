import { UnsplashImage } from "@/types/types";

export async function getRandomImage(): Promise<UnsplashImage | null> {
    try {
        const res = await fetch('/api/unsplash', { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Failed to load random image:", error);
        return null;
    }
}