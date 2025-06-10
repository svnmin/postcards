import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export async function handleSubmit(message : string, trackData : any){
  const db =getDatabase();
  const postcardRef = ref(db, 'postcards');
  const newPostcardRef = push(postcardRef);

  await set(newPostcardRef, {
    message,
    track : trackData,
    createdAt : Date.now(),
  });
  const id = newPostcardRef.key;
  return id;
}
export async function getPostcard(id : string){
  const dbRef = ref(getDatabase(app));
  const snapshot = await get(child(dbRef, `postcards/${id}`));
  if(!snapshot.exists()) return null;
  return snapshot.val();
}
