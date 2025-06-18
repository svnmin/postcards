import { Track, UnsplashImage } from "@/types/types";
import { initializeApp } from "firebase/app"
import { addDoc, collection, doc, getDoc, getFirestore, Timestamp, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handleSubmit(
    message: string,
    trackData: Track,
    imageData: UnsplashImage
): Promise<string> {
    const slimTrack = {
        id: trackData.id,
        name: trackData.name,
        artists: trackData.artists,
        url: `https://open.spotify.com/track/${trackData.id}`
    };
    const slimImage = {
        url: imageData?.url || "",
        link: imageData?.link || "",
        user: {
            name: imageData?.user?.name || "Unknown",
            username: imageData?.user?.username || "",
        },
    };
    const postcardRef = collection(db, "postcards");
    const newDoc = await addDoc(postcardRef, {
        message,
        track: slimTrack,
        image: slimImage,
        createdAt: Timestamp.now()
    });
    return newDoc.id;
};
export async function getPostcard(id: string) {
    const docRef = doc(db, "postcards", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    //Rolling Expiration  7 days cycle
    // const now = Date.now();
    // const createdAt = data.createdAt?.toDate?.() || new Date();
    // const ageMs = now - createdAt.getTime();
    // const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    // if(ageMs < sevenDaysMs) {
    //     await updateDoc(docRef, {
    //         createdAt: Timestamp.now(),
    //     });
    //     console.log(`Extended expiration of postcard ${id}`)
    // }

    return data;

};